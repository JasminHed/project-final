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
  res.send("Hello, Welcome to The Intention App!");
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
      name: user.name 
    });
  } else {
    res.json({ notFound: true });
  }
});

// Endpoint for private/public
app.patch("/users/public-status", authenticateUser, async (req, res) => {
  const { isPublic } = req.body;

  try {
    req.user.isPublic = isPublic;
    await req.user.save();
    res.status(200).json({ success: true, message: "Public status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update status" });
  }
});


//Authorization

//Dashboard
//GET - Get user data (name and email) of a user by their user ID
/*app.get("/users/:id", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});*/

//Setup
// POST - Create intention+smart goal as a logged in user
app.post("/goals", authenticateUser, async (req, res) => {
  const { intention, specific, measurable, achievable, relevant, timebound } = req.body;
  
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

// PATCH - Update goal by id, only user can edit int+goal and keeps it sync with edits, updates 
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

    // ispublic
    if (updates.hasOwnProperty("isPublic")) {
      if (updates.isPublic) {
        // create or update community post to community
        await CommunityPost.findOneAndUpdate(
          { userId: req.user._id, goalId: updatedGoal._id },
          {
            userId: req.user._id,
            goalId: updatedGoal._id,
            intention: updatedGoal.intention,
            specific: updatedGoal.specific,
            measurable: updatedGoal.measurable,
            achievable: updatedGoal.achievable,
            relevant: updatedGoal.relevant,
            timebound: updatedGoal.timebound,
            createdAt: new Date(),
            userName: req.user.name,
          },
          { upsert: true, new: true }
        );
      } else {
        // remove community post if ispublic is false
        await CommunityPost.deleteOne({
          userId: req.user._id,
          goalId: updatedGoal._id
        });
      }
    } else if (req.user.isPublic && !updatedGoal.completed) {
      // if isPublic true and goals are non complete, update community-post as usual
      await CommunityPost.findOneAndUpdate(
        { userId: req.user._id, goalId: updatedGoal._id },
        {
          userId: req.user._id,
          goalId: updatedGoal._id,
          intention: updatedGoal.intention,
          specific: updatedGoal.specific,
          measurable: updatedGoal.measurable,
          achievable: updatedGoal.achievable,
          relevant: updatedGoal.relevant,
          timebound: updatedGoal.timebound,
          createdAt: new Date(),
          userName: req.user.name,
        },
        { upsert: true, new: true }
      );
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

//GET community-post 
app.get('/community-posts', async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


//POST in community
/*app.post('/community-posts', authenticateUser, async (req, res) => {
  const post = new CommunityPost({
    ...req.body,
    userId: req.user._id,
    userName: req.user.name 
  });
  await post.save();
  res.json(post);
});*/


// POST - Like a community-post
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
      response: error,
      message: "Failed to like the post",
    });
  }
});

// POST Comment on a specific community‑post  
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

    res.status(201).json({
      success: true,
      response: comment,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to add comment",
    });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});