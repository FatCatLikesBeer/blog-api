const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');

/* Get all posts & comments */
exports.api_get_all_content = asyncHandler(async (req, res, next) => {
  res.send('apiController: get all content not yet implemented.');
});

/* Create a new post */
exports.api_post_create = asyncHandler(async (req, res, next) => {
  const [title, body] = [req.body.title, req.body.body];
  if (typeof title === 'undefined' || typeof body === 'undefined') {
    res.send("Post needs a title and a body!")
  };
  const post = new PostModel({
    title: title,
    body: body,
  });
  await post.save();
  res.send(post);
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
