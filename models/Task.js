// Task.js
// Mongoose model, responsible for defining structure of certain object structures - tasks

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: {
    required: true,
    type: String
  },
  priority: {
    required: true,
    type: Boolean
  },
  active: {
    required: true,
    type: Boolean
  },
  creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listID: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('Task', TaskSchema);