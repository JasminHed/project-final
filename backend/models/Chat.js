import mongoose from "mongoose";

//Chat is the model we use in code to create, read, update, and save chats in MongoDB.
//Without this schema, we couldn’t persist chat history or differentiate between users, so the AI wouldn’t have context for conversations.
//It saves each message with its role (user or assistant), content, and timestamp. It also stores a whole chat session, linking it to a userId (if logged in) or a sessionId (for guests)

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
    type: String,
    default: null // anyone
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [messageSchema]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;