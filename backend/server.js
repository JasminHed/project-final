import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

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

// Endpoint for private/public
app.patch("/users/public-status", authenticateUser, async (req, res) => {
  const { isPublic } = req.body;

  try {
    // Update user's public status
    req.user.isPublic = isPublic;
    await req.user.save();

    if (isPublic) {
      // Add all incomplete goals to community
      const incompleteGoals = await Goal.find({ 
        userId: req.user._id, 
        completed: { $ne: true } 
      });

      for (const goal of incompleteGoals) {
        await CommunityPost.findOneAndUpdate(
          { userId: req.user._id, goalId: goal._id },
          {
            userId: req.user._id,
            goalId: goal._id,
            userName: req.user.name,
            intention: goal.intention,
            specific: goal.specific,
            measurable: goal.measurable,
            achievable: goal.achievable,
            relevant: goal.relevant,
            timebound: goal.timebound,
            createdAt: new Date()
          },
          { upsert: true, new: true }
        );
      }
    } else {
      // Remove all user's posts from community
      await CommunityPost.deleteMany({ userId: req.user._id });
    }

    res.status(200).json({ 
      success: true, 
      message: "Public status updated",
      user: { isPublic: req.user.isPublic }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Could not update status" 
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
      timebound
    });
    
    const savedGoal = await newGoal.save();
    if (req.user.isPublic) {
      const communityPost = new CommunityPost({
        userId: req.user._id,
        userName: req.user.name,
        intention,
        specific,
        measurable,
        achievable,
        relevant,
        timebound
      });
      await communityPost.save();
    }    

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


// AI get - check in & motivation (motovation 3 times/week and check-in 2times/week)
app.get("/api/weekly-messages", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    const today = new Date();
    const lastMessage = new Date(user.lastMessageDate || 0);
    const diffDays = (today - lastMessage) / (1000 * 60 * 60 * 24);
 
    if (diffDays < 1) {
      return res.json({ message: "You got everything you need today" });
    }
 
    const motivations = [
      "Keep going! You're doing great.",
      "Remember why you set your goal in the first place.",
      "Small steps every day lead to big changes!"
    ];
 
    const checkins = [
      "How are you feeling about your progress this week?",
      "What's been your biggest win lately?",
      "Which goal needs the most attention right now?",
      "How are you balancing your intentions with daily life?",
      "What's challenging you the most in your journey?"
    ];
 
    // Alternate between motivation and check-in
    const isMotivation = Math.random() > 0.4; // 60% motivation, 40% check-in
    const messages = isMotivation ? motivations : checkins;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
 
    user.lastMessageDate = today.toISOString().slice(0, 10);
    await user.save();
 
    res.json({ 
      message: randomMessage, 
      type: isMotivation ? 'motivation' : 'checkin' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get message." });
  }
 });

 //Chat

 app.post("/api/chat", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-...r5QA"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful coach and assistant that guides the user through the website structure and content and with their intention setting and SMART goal setting. The user is on this webpage because they are creating and setting up their intention and SMART goal to make a change, reach a goal, create a dreamlife. They can have up to three intention + SMART goals at a time."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//get user info to dashboard
app.get("/users/me", authenticateUser, (req, res) => {
  const { name, email, isPublic } = req.user;
  res.json({ name, email, isPublic });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});