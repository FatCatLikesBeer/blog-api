const indexRouter = require('./routes/indexRouter.js');
const apiRouter = require('./routes/apiRouter.js');

const request = require('supertest');
const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use('/api', apiRouter);

//// ------ MongoDB Stuff ------ ////
beforeAll(async = () => {
  const mongoDB = process.env.MONGODB_BLOG;
  mongoose.connect(mongoDB);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDb connection error"));
});
afterAll(async () => {
  await mongoose.connection.close();
});

//// ------ Testing Stuff ------ ////
test("Testing API root GET", done => {
  request(app)
  .get('/api/post')
  .expect("Content-Type", /json/)
  .then( data => {
      expect(data.error).toEqual(false)
    })
  .then(done)
});
