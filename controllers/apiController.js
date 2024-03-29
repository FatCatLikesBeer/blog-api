const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const marked = require('marked');

/* Get all posts & comments */
exports.api_get_all_content = asyncHandler(async (req, res, next) => {
  const getPosts = await PostModel.find().sort({ timeStamp: -1 }).exec();
  allPosts = getPosts.map( e => {
    e.body = marked.parse(e.body);
    return e;
  });
  res.json(allPosts);
});

/* Create a new post */
exports.api_post_create = asyncHandler(async (req, res, next) => {
  const [title, body, secret] = [req.body.title, req.body.body, req.body.secret];
  if (secret === process.env.BLOG_SECRET) {
    if (typeof title === 'undefined' || typeof body === 'undefined') {
      res.send("Post needs a title and a body!")
    };
    const post = new PostModel({
      title: title,
      body: body,
    });
    await post.save();
    res.redirect('/');
  } else {
    res.redirect('/error');
  };
});

/* Update an existing post */
exports.api_post_update = asyncHandler(async (req, res, next) => {
  res.send('apiController: update existing post not yet implemented.');
});

/* Delete an existing post */
exports.api_post_delete = asyncHandler(async (req, res, next) => {
  res.send('apiController: delete existing post not yet implemented.');
});

/* Create a new comment */
exports.api_comment_create = asyncHandler(async (req, res, next) => {
  res.send('apiController: create new comment not yet implemented.');
});

/* Delete a comment */
exports.api_comment_delete = asyncHandler(async (req, res, next) => {
  res.send('apiController: delete existing comment not yet implemented.');
});


