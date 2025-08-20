import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";

import Chat from "./models/Chat.js";
import CommunityPost from "./models/CommunityPost.js";
import Goal from "./models/Goal.js"
import User from "./models/User.js";

dotenv.config();



//Connects to mongoDB database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);



//Authenitcation middleware
const authenticateUser = async (req, res, next) => {
  

  const user = await User.findOne({ accessToken: req.header("Authorization") });
 

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "You must be logged in to access this resource",
      loggedOut: true,
    });
  }
};

const port = process.env.PORT || 8080;
const app = express();

//app.use(cors());
app.use(cors({
  origin: ["https://finalprojectjasmin.netlify.app", "http://localhost:5173"],
  credentials: true 
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Welcome to Intention Hub!");
});

// Endpoint to register 
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync();
    const user = new User({ 
      name, 
      email, 
      password: bcrypt.hashSync(password, salt) 
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created",
      id: user._id,
      accessToken: user.accessToken,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        return res.status(400).json({
          success: false,
          message: "That email address already exists"
        });
      }
      if (error.keyValue.name) {
        return res.status(400).json({
          success: false,
          message: "That username already exists"
        });
      }
    }
    res.status(400).json({
      success: false,
      message: "Could not create user",
      errors: error
    });
  }
});

//Endpoint for log in
app.post("/sessions", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  });
  
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ 
      userId: user._id,
      accessToken: user.accessToken,
      name: user.name,
      email: user.email 
    });
  } else {
    res.json({ notFound: true });
  }
});

// GET current user
app.get("/users/me", authenticateUser, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isPublic: req.user.isPublic,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch user", error });
  }
});



// Endpoint for sharing a dashboard card to community
app.post("/goals/:goalId/share", authenticateUser, async (req, res) => {
  const { goalId } = req.params;
  const { shared } = req.body; // boolean, true = share, false = unshare

  try {

    const goal = await Goal.findOne({ _id: goalId, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    if (shared) {
     
      const communityPost = new CommunityPost({
        userId: req.user._id,
        userName: req.user.name,
        intention: goal.intention, 
        goals: [{
          intention: goal.intention,
          specific: goal.specific,
          measurable: goal.measurable,
          achievable: goal.achievable,
          relevant: goal.relevant,
          timebound: goal.timebound
        }],
        createdAt: new Date()
      });

      await communityPost.save();

      
      goal.shared = true;
      await goal.save();

      return res.status(201).json({
        success: true,
        message: "Goal shared to community",
        response: communityPost
      });
    } else {
  
      await CommunityPost.deleteMany({ userId: req.user._id, "goals._id": goal._id });

     
      goal.shared = false;
      await goal.save();

      return res.status(200).json({
        success: true,
        message: "Goal removed from community"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not update goal sharing",
      error
    });
  }
});


//Setup
// POST - Create intention+smart goal as a logged in user
app.post("/goals", authenticateUser, async (req, res) => {
  const { intention, specific, measurable, achievable, relevant, timebound } = req.body;

  // Check if user already has 3 active goals
const activeGoalsCount = await Goal.countDocuments({ 
  userId: req.user._id, 
  completed: { $ne: true } 
});

if (activeGoalsCount >= 3) {
  return res.status(400).json({
    success: false,
    message: "You can only have 3 active goals at a time. Complete existing goals first."
  });
}
  
  try {
    //Checks for exisiting intention+goal. No duplicates aload
const existingGoal = await Goal.findOne({ userId: req.user._id, intention });
if (existingGoal) {
  return res.status(400).json({
    success: false,
    message: "You already have a goal with this intention."
  });
}

    const newGoal = new Goal({
      userId: req.user._id, //associate each user with each goal they create
      intention,
      specific,
      measurable, 
      achievable,
      relevant,
      timebound,
      started: false
    });
    
    const savedGoal = await newGoal.save();
    res.status(201).json({
      success: true,
      response: savedGoal,
      message: "Goal created successfully"
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to create goal. Try again."
    });
  }
});

// GET - gets all goals that belong to the logged-in user so they can see them in dahsboard
app.get("/goals", authenticateUser, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

//PATCH - Update goal by id, only user can edit int+goal and keeps it sync with edits, updates 
app.patch("/goals/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Update goal
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found. Try again."
      });
    }

    // remove community post if goal is complete
    if (updates.completed === true) {
      await CommunityPost.deleteOne({
        userId: req.user._id,
        intention: updatedGoal.intention
      });
    }

    res.status(200).json({
      success: true,
      response: updatedGoal,
      message: "Goal updated successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to update goal. Try again."
    });
  }
});


//Community
// GET - All Community Posts (Newest First)
app.get("/community-posts", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error,
    });
  }
});

// POST - Like a Community Post
app.post("/community-posts/:id/like", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPost = await CommunityPost.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Community post not found",
      });
    }

    res.status(200).json({
      success: true,
      response: updatedPost,
      message: "Like added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to like the post",
      error,
    });
  }
});

// POST - Add a Comment to a Community Post
app.post("/community-posts/:id/comments", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Comment text is required",
    });
  }

  try {
    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found",
      });
    }

    const comment = {
      text,
      userName: req.user.name,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const newComment = post.comments[post.comments.length - 1]; // includes _id

    res.status(201).json({
      success: true,
      response: newComment,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error,
    });
  }
});

// DELETE - Remove a Comment by ID (from any post)
app.delete("/messages/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await CommunityPost.findOne({ "comments._id": id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
//control if user owns the comment before deleteing
    const comment = post.comments.find(comment => comment._id.toString() === id);
    if (comment.userName !== req.user.name) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== id
    );

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the comment",
      error,
    });
  }
});




 //Chat

 app.post("/api/chat", async (req, res) => {
  try {
   
    
    const user = req.user || null;
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      
      return res.status(400).json({ error: "Message and sessionId required" });
    }


    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
     
      chat = new Chat({
        userId: user?.id || null,
        sessionId,
        messages: []
      });
    } else {
    
    }

   
    chat.messages.push({
      role: "user",
      content: message
    });

    
    const recentMessages = chat.messages.slice(-10).map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    }));

    console.log("Sending to OpenAI:", {
      messageCount: recentMessages.length,
      apiKey: process.env.OPENAI_API_KEY ? "Present" : "Missing"
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Luca, a helpful coach and assistant that guides users through intention setting and SMART goal setting. Keep responses conversational and supportive."
          },
          ...recentMessages
        ]
      })
    });

  

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
   

    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";
    
    if (aiMessage === "Sorry, I couldn't respond.") {
      console.error("No valid response from OpenAI:", data);
    }

   
    chat.messages.push({
      role: "assistant",
      content: aiMessage
    });

    await chat.save();
    
    
    res.json({
      message: aiMessage,
      sessionId: chat.sessionId
    });
    
  } catch (error) {
    console.error("=== CHAT ERROR ===");
    console.error("Error details:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Could not process chat message: " + error.message });
  }
});

 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});