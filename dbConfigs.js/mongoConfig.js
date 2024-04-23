//// mongoConfig.js

const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_BLOG;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDb connection error"));
