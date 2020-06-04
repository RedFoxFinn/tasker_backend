// Comment.js
// Mongoose model, responsible for defining structure of certain object structures - comments

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment: {
    required: true,
    type: String
  },
  karma: {
    required: true,
    type: Number
  },
  addedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listID: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Comment', CommentSchema);