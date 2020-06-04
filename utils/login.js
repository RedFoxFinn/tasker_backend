// rff-demo gql_resolvers.js
// provides resolvers for apollo server in express

const login = require('express').Router();
const config = require('./config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User.js');

login.post('/', async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ username: body.username });
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && correctPassword)) {
    return res.status(401).json({ error: 'Incorrect username or password!' });
  } else {
    const userForToken = {
      username: user.username,
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(userForToken, config.secret);
    res.status(200).json({ token: token, username: user.username, userID: user._id, role: user.role });
  }
});

module.exports = login;
