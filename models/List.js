// List.js
// Mongoose model, responsible for defining structure of certain object structures - lists

const mongoose = require('mongoose');

const options = {
  discriminatorKey: 'listType',
  collection: 'lists'
};

const ListSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
    unique: true
  },
  removable: {
    required: true,
    type: Boolean
  }
}, options);

module.exports = mongoose.model('List', ListSchema);