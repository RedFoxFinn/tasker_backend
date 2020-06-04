if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const MONGODB_URI = () => {
  switch (process.env.NODE_ENV) {
  case 'production':
    return process.env.MONGO_URI_PROD;
  case 'development':
    return process.env.MONGO_URI_DEV;
  case 'testing':
    return process.env.MONGO_URI_TEST;
  case 'staging':
    return process.env.MONGO_URI_TEST;
  default:
    return process.env.MONGO_URI_DEV;
  }
};

const PORT = process.env.PORT || 4010;
const SECRET = process.env.SECRET;

module.exports = {
  mongo: MONGODB_URI(), port: PORT, secret: SECRET, env: process.env.NODE_ENV
};
