// CookingMethod.js
// Mongoose model, responsible for defining structure of certain object structures - cooking methods

const mongoose = require('mongoose');

const CookingMethodSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true
  },
  uses: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
  },
  addedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('CookingMethod', CookingMethodSchema);