// Dish.js
// Mongoose model, responsible for defining structure of certain object structures - dishes

const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true
  },
  cookingMethods: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CookingMethod' }]
  },
  proteins: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }]
  },
  carbs: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }]
  },
  spices: {
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }]
  },
  karma: {
    required: true,
    type: Number
  },
  note: {
    required: true,
    type: String
  },
  addedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Dish', DishSchema);