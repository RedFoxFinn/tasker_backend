// Group.js
// Mongoose model, responsible for defining structure of certain object structures - groups

const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
    unique: true
  },
  active: {
    required: true,
    type: Boolean
  },
  removable: {
    required: true,
    type: Boolean
  },
  creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Group', GroupSchema);