import bcrypt from "bcrypt";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import Goal from "./models/Goal.js"
import User from "./models/User.js";

dotenv.config(); 

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({ 
    accessToken: req.header("Authorization") 
  });
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
  res.send("Hello Intention App!");
});

// Auth endpoints
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

// Add goal endpoints here later
// app.post("/goals", authenticateUser, async (req, res) => { ... });
// app.get("/goals", authenticateUser, async (req, res) => { ... });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});