// rff-demo gql_server.js
// project backend - apollo server
// responsible of connecting to database

// imports
const config = require('../utils/config.js');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const { resolvers } = require('./gql_resolvers');
const { typeDefs } = require('./gql_typeDefs');
const User = require('../models/User');

// initializing Apollo Server for Express
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.secret);
      const user = await User.findById(decodedToken.id);
      return { user };
    }
    return null;
  }
});

module.exports = apolloServer;