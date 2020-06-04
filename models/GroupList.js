// GroupList.js
// Mongoose model, responsible for defining structure of certain object structures - lists - group

const mongoose = require('mongoose');
const List = require('./List');

const GroupListSchema = new mongoose.Schema({
  group: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
});

const GroupList = List.discriminator('GroupList', GroupListSchema);

module.exports = GroupList;