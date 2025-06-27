import bcrypt from "bcrypt";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import CommunityPost from "./models/CommunityPost.js";
import Goal from "./models/Goal.js"
import User from "./models/User.js";

dotenv.config(); 

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

//testing
mongoose.connection.on('connected', () => {
  console.log('Connected to database:', mongoose.connection.db.databaseName);
});

//Authenitcation middleware
const authenticateUser = async (req, res, next) => {
  console.log("Authorization received:", req.header("Authorization"));

  const user = await User.findOne({ accessToken: req.header("Authorization") });
  console.log("User found:", user ? "YES" : "NO");

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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Welcome to The Intention App!");
});

// Auth endpoints to signup and login
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

//Authorization
//To post, get and edit a goal in setup page

// POST - Create goals
app.post("/goals", authenticateUser, async (req, res) => {

  console.log("Goal creation started");
  console.log("Request body:", req.body);
  console.log("User ID:", req.user._id);
  const { intention, specific, measurable, achievable, relevant, timebound } = req.body;
  
  try {
    const newGoal = new Goal({
      userId: req.user._id, //is this needed?
      intention,
      specific,
      measurable, 
      achievable,
      relevant,
      timebound
    });
    console.log("About to save goal:", newGoal);
    const savedGoal = await newGoal.save();
    console.log("Goal saved successfully:", savedGoal);

    res.status(201).json({
      success: true,
      response: savedGoal,
      message: "Goal created successfully"
    });
  } catch (error) {
    console.log("Error saving goal:", error);
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to create goal. Try again."
    });
  }
});

// GET - Get user's goals
app.get("/goals", authenticateUser, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// PATCH - Update goal
app.patch("/goals/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
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

//GET - Get user data 
app.get("/users/:id", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//Post in community
app.post('/community-posts', authenticateUser, async (req, res) => {
  const post = new CommunityPost({
    ...req.body,
    userId: req.user_id
  });
  await post.save();
  res.json(post);
});

//Get the post to be able to post them
app.get('/community-posts', async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});