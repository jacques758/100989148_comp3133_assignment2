const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use(
  '/api/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

module.exports = app;