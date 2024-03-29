const express = require('express');
const asyncHander = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const marked = require('marked');

/* Index page GET */
exports.index_get = asyncHander(async (req, res, next) => {
  const getPosts = await PostModel.find().sort({ timeStamp: -1 }).exec();
  allPosts = getPosts.map( e => {
    e.body = marked.parse(e.body);
    return e;
  });
  console.log(req.user);
  res.render('index', {
    title: "Billy's Blog",
    posts: allPosts,
  });
});

