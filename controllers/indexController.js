const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const marked = require('marked');

/* Index page GET */
exports.index_get = asyncHandler(async (req, res, next) => {
  const allPosts = await fetch('http://free.local:3000/api/post').then(data => data.json());
  res.render('index', {
    title: "Billy's Blog",
    posts: allPosts,
  });
});

