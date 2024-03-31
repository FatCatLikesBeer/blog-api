const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const marked = require('marked');

/* Get all posts & comments */
exports.api_get_all_content = asyncHandler(async (req, res, next) => {
  const getPosts = await PostModel.find().sort({ timeStamp: -1 }).exec();
  allPosts = getPosts.map( post => {
    const result = {
      title: post.title,
      body: marked.parse(post.body),
      author: post.author,
      _id: post._id,
      date: post.date,
      url: post.url,
      type: post.type,
    }
    return result;
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
    console.log("Article Posted Successfully");
    res.json({
      error: false,
      message: "Article Posted Successfully",
      postId: post._id,
      redirect: '/',
    });
  } else {
    console.log("Wrong Secret");
    res.json({
      error: true,
      message: "Unauthorized",
    });
  };
});

/* Update an existing post */
exports.api_post_update = asyncHandler(async (req, res, next) => {
  const [title, body, secret] = [req.body.title, req.body.body, req.body.secret];
  const post = await PostModel.findById(req.params.postId).exec();
  const updatePost = new PostModel({
    title: title,
    body: body,
    author: post.author,
    _id: post._id,
    timeStamp: post.timeStamp,
  });
  if (secret === process.env.BLOG_SECRET) {
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, updatePost, {});
    console.log("Article Updated Successfully");
    res.json({
      error: false,
      message: "Article Updated Successfully",
      postId: post._id,
      redirect: '/',
    });
  } else {
    console.log("Wrong Secret");
    res.json({
      error: true,
      message: "Unauthorized",
      postId: post._id,
    });
  }
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


