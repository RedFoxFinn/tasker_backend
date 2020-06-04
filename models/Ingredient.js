// Ingredient.js
// Mongoose model, responsible for defining structure of certain object structures - ingredients

const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  type: {
    required: true,
    type: String
  },
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

module.exports = mongoose.model('Ingredient', IngredientSchema);