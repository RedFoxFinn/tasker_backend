// rff-demo dbInit.js
// test helper utility

// imports

const { Ingredient, CookingMethod } = require('../models/modelImporter');

const dbPusher = async (type, data, user) => {
  let err = false;
  switch (type) {
  case 'carb':
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      const newCarb = new Ingredient({
        type: 'carb',
        name: c.name,
        uses: [],
        addedBy: user
      });
      try {
        await newCarb.save();
      } catch (e) {
        console.error(e);
        err = true;
      }
    }
    return !err;
  case 'protein':
    for (let i = 0; i < data.length; i++) {
      const p = data[i];
      const newProtein = new Ingredient({
        type: 'protein',
        name: p.name,
        uses: [],
        addedBy: user
      });
      try {
        await newProtein.save();
      } catch (e) {
        console.error(e);
        err = true;
      }
    }
    return !err;
  case 'spice':
    for (let i = 0; i < data.length; i++) {
      const s = data[i];
      const newSpice = new Ingredient({
        type: 'spice',
        name: s.name,
        uses: [],
        addedBy: user
      });
      try {
        await newSpice.save();
      } catch (e) {
        console.error(e);
        err = true;
      }
    }
    return !err;
  case 'method':
    for (let i = 0; i < data.length; i++) {
      const m = data[i];
      const newMethod = new CookingMethod({
        name: m.name,
        uses: [],
        addedBy: user
      });
      try {
        await newMethod.save();
      } catch (e) {
        console.error(e);
        err = true;
      }
    }
    return !err;
  default:
    return err;
  }
};

module.exports = dbPusher;