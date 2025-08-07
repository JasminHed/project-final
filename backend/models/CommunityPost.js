const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  intention: String,
  specific: String,
  measurable: String,
  achievable: String,
  relevant: String,
  timebound: String,
  userName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // gives the comment a unique id, needed for deletion
    text: String,
    userName: String,
    createdAt: { type: Date, default: Date.now }
  }]
  
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);