// PrivateList.js
// Mongoose model, responsible for defining structure of certain object structures - lists - private

const mongoose = require('mongoose');
const List = require('./List');

const PrivateListSchema = new mongoose.Schema({
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const PrivateList = List.discriminator('PrivateList', PrivateListSchema);

module.exports = PrivateList;