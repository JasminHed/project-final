import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // anyone
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  lastCheckinDate: { //to see if check in is necessary
    type: Date,
    default: null
  }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;