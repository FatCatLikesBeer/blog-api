const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const CommentModel = require('../models/commentSchema.js');
const marked = require('marked');

////// ------ POST APIs ------ //////
/* Get all posts & comments */
exports.api_get_all_content = asyncHandler(async (req, res, next) => {
  let getPosts;
  try {
    getPosts = await PostModel.find().sort({ timeStamp: -1 }).exec();
    getComments = [];
  } catch (error) {
    res.json({
      error: true,
      message: "Problem Retrieving Posts 😕",
      postId: null,
    });
  };
  // Mapping is needed to get the virtual properties to work properly.
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
  allComments = getComments.map( comment => {
    const result = {
      _id: comment._id,
      author: comment.author,
      body: comment.body,
      date: comment.date,
      url: comment.url,
    }
    return result;
  });
  res.json({
    error: false,
    message: "Posts Retrieve Successfully",
    postId: null,
    redirect: '/',
    data: {
      posts: allPosts,
      comments: allComments,
    },
  });
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
      redirect: `/post/${post._id}`,
    });
  } else {
    console.log("Wrong Secret");
    res.json({
      error: true,
      message: "Unauthorized",
      postId: null,
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
      redirect: `/post/${post._id}`,
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
  const secret = req.body.secret;
  let post;
  if (secret === process.env.BLOG_SECRET) {
    try {
      const condition = { post: req.params.postId };
      post = await PostModel.findById(req.params.postId).exec();
      await CommentModel.deleteMany(condition).catch( error => {
        console.error("Error deleting comments", error);
      });
      await PostModel.findByIdAndDelete(req.params.postId);
      res.json({
        error: false,
        message: "Post Deleted Successfully",
        postId: req.params.postId,
        redirect: "/",
        data: null,
      });
    } catch (error) {
      res.json({
        error: true,
        message: "Error finding post by ID.",
        postId: req.params.postId,
      });
    }
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: req.params.postId,
    });
  }
});

/* Get post detail */
exports.api_post_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).exec();
    const comments = await CommentModel.find({ post: req.params.postId }).exec();
    res.json({
      error: false,
      message: "Post Retrieved Successfully",
      postId: req.params.postId,
      redirect: "/",
      data: {
        post: marked.parse(post),
        comments: comments,
      },
    });
  } catch (error) {
    res.json({
      error: true,
      message: "Post Retrieval Failed",
      postId: req.params.postId,
    });
  }
});

////// ------ COMMENT APIs ------ //////
/* Create a new comment */
exports.api_comment_create = asyncHandler(async (req, res, next) => {
  const [post, body, author] = [req.params.postId, req.body.body, req.body.author];
  const newComment = new CommentModel({
    post: post,
    body: body,
    author: author,
  });
  try {
    await newComment.save();
    res.json({
      error: false,
      message: "Comment Posted Successfully",
      postId: post,
      redirect: `${newComment.url}`,
      data: null
    })
  } catch (error) {
    res.json({
      error: true,
      message: "Comment Posting Failed",
      postId: post,
    });
  }
});

/* Delete a comment */
exports.api_comment_delete = asyncHandler(async (req, res, next) => {
  const secret = req.body.secret;
  if (secret === process.env.BLOG_SECRET) {
    try {
      const comment = await CommentModel.findById(req.params.commentId).exec();
      const post = await PostModel.findById(comment.post).exec();
      await CommentModel.findByIdAndDelete(req.params.commentId);
      res.json({
        error: false,
        message: "Comment Deleted Successfully",
        commentId: req.params.commentId,
        redirect: post.url,
        data: null,
      })
    } catch (error) {
      res.json({
        error: true,
        message: "Comment Deletion Failed",
        commentId: req.params.commentId,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      commentId: req.params.commentId,
    });
  };
});

/* Get comment detail */
exports.api_comment_detail = asyncHandler(async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    res.json({
      error: false,
      message: "Comment Detail Retrieved Successfully",
      commentId: req.params.commentId,
      redirect: comment.url,
      data: comment,
    });
  } catch (error) {
    res.json({
      error: true,
      message: "Comment Detail Retrieval Failed",
      commentId: req.params.commentId,
    });
  };
});

// Error message layout
//
// {
//   error: false,
//   message: "Request Type Verbed Successfully",
//   postId: req.params.postId || post._id,
//   redirect: '/post/:postId' || '/',
//   data: data,
// }
//
// {
//   error: true,
//   message: "Message type",
//   postId: req.params.postId,
// }


