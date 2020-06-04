// User.js
// Mongoose model, responsible for defining structure of certain object structures - user

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  removable: {
    type: Boolean,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  groups: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
  },
  stops: {
    required: true,
    type: [{ type: String }]
  }
});

module.exports = mongoose.model('User', UserSchema);