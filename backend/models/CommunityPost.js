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
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [{ text: String, userName: String, createdAt: Date }]
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);