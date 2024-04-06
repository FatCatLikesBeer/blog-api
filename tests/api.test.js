const indexRouter = require('../routes/indexRouter.js');
const apiRouter = require('../routes/apiRouter.js');

const request = require('supertest');
const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use('/api', apiRouter);

//// ------ MongoDB Stuff ------ ////
beforeAll(async () => {
  const mongoose = require('../dbConfigs.js/mongoConfigTesting.js');
  await mongoose.initializeMongoServer();
});
afterAll(async () => {
  const mongoose = require('../dbConfigs.js/mongoConfigTesting.js');
  await mongoose.closeMongoServer();
});

//// ------ GET all posts ------ ////
test("Testing API Get all posts", async () => {
  const result = await request(app)
    .get('/api/post')
    .expect("Content-Type", /json/);

  const parsedResult = JSON.parse(result.text);

  const [resultError, resultMessage] = [parsedResult.error, parsedResult.message];

  expect(resultError).not.toBeUndefined();
  expect(resultError).toBeFalsy();
  expect(resultMessage).toBe("Posts Retrieved Successfully");
});

//// ------ GET post Detail ------ ////
// test("GET Post Detail", async () => {
//   const result = await request(app)
//     .get('/api/post')
//     .expect("Content-Type", /json/);
//   const parsedResult = JSON.parse(result.text);
//   const resultId = parsedResult.data.posts[0]._id;
//
//   const getDetail = await request(app)
//     .get(`/api/post/${resultId}`)
//     .expect("Content-Type", /json/)
//   const parsedDetail = JSON.parse(getDetail.text);
//
//   expect(parsedDetail.error).not.toBeUndefined();
//   expect(parsedDetail.error).toBeFalsy();
//   console.log("Full result", result);
//   console.log("Full getDetail", getDetail);
// });
