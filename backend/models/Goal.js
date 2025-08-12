import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  intention: { type: String, required: true, minlength: 20, maxlength: 150  },
  specific: { type: String, required: true, minlength: 20, maxlength: 150 },
  measurable: { type: String, required: true, minlength: 20, maxlength: 150 },
  achievable: { type: String, required: true, minlength: 20, maxlength: 150 },
  relevant: { type: String, required: true, minlength: 20, maxlength: 150 },
  timebound: { type: String, required: true, minlength: 20, maxlength: 150 },
  completed: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;