const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const CommentModel = require('../models/commentSchema.js');
const marked = require('marked');

const routeLog = (req, message, state) => {
  let color = "\x1b[32m";
  if (state === "error") {
    color = "\x1b[31m";
  }
  console.log("--------");
  console.log("API CONTROLLER")
  console.log("Date:\t", Date());
  console.log("Route:\t", req.route.path);
  console.log("Method:\t", req.method);
  console.log("Mssg:\t", color + message);
  console.log("\x1b[0m" + "--------");
};

////// ------ POST APIs ------ //////
/* Get all posts & comments */
exports.api_get_all_content = asyncHandler(async (req, res, next) => {
  let getPosts;
  try {
    getPosts = await PostModel.find().sort({ timeStamp: -1 }).exec();
    getComments = await CommentModel.find().sort({ timeStamp: -1 }).exec();
  } catch (error) {
    res.json({
      error: true,
      message: "Problem Retrieving Posts 😕",
      postId: null,
    });
    routeLog(req, "Problem retrieving posts/comments from ORM", "error");
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
      post: comment.post,
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
    message: "Posts Retrieved Successfully",
    postId: null,
    redirect: '/',
    data: {
      posts: allPosts,
      comments: allComments,
    },
  });
  routeLog(req, "Posts & Comments Retrieved Successfully");
});

/* Create a new post */
exports.api_post_create = asyncHandler(async (req, res, next) => {
  const [title, body, secret] = [req.body.title, req.body.body, req.body.secret];
  if (secret === process.env.BLOG_SECRET) {
    if (typeof title === 'undefined' || typeof body === 'undefined') {
      res.json({
        error: true,
        message: "Post needs a title and a body!",
        postId: null,
      });
      routeLog(req, "Post request lacks title & body!", "error")
    };
    const post = new PostModel({
      title: title,
      body: body,
    });
    await post.save();
    res.json({
      error: false,
      message: "Article Posted Successfully",
      postId: post._id,
      redirect: `/post/${post._id}`,
    });
    routeLog(req, "Article Posted Successfully");
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: null,
    });
    routeLog(req, "Wrong secret", "error");
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
    res.json({
      error: false,
      message: "Article Updated Successfully",
      postId: post._id,
      redirect: `/post/${post._id}`,
    });
    routeLog(req, "Article Updated Successfully");
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: post._id,
    });
    routeLog(req, "Wrong Secret", "error");
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
      routeLog(req, "Post Deleted Successfully");
    } catch (error) {
      res.json({
        error: true,
        message: "Error finding post by ID.",
        postId: req.params.postId,
      });
      routeLog(req, "Error finding post by ID.", "error");
    }
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: req.params.postId,
    });
    routeLog(req, "Wrong secret", "error");
  }
});

/* Get post detail */
exports.api_post_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).exec();
    const comments = await CommentModel.find({ post: req.params.postId }).exec();
    const parsedPost = {
      title: post.title,
      body: marked.parse(post.body),
      author: post.author,
      _id: post._id,
      date: post.date,
      url: post.url,
      type: post.type,
    }
    const parsedComments = comments.map( comment => {
      const result = {
        post: comment.post,
        _id: comment.post,
        body: marked.parse(comment.body),
        author: comment.body,
        date: comment.date,
        url: comment.url,
      };
      return result;
    })
    res.json({
      error: false,
      message: "Post Retrieved Successfully",
      postId: req.params.postId,
      redirect: "/",
      data: {
        post: parsedPost,
        comments: parsedComments,
      },
    });
    routeLog(req, "Post Retrieved Successfully")
  } catch (error) {
    console.log(error);
    res.json({
      error: true,
      message: "Post Retrieval Failed",
      postId: req.params.postId,
    });
    routeLog(req, "Post Retrieval Failed", "error");
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
  await newComment.save()
  .then( savedComment => {
    console.log("Comment Saved", savedComment);
  })
  .catch( error => {
    routeLog(req, "Comment Posting Failed", "error");
    console.error(error);
    res.json({
      error: true,
      message: "Comment Posting Failed",
      postId: post,
    });
  });
  res.json({
    error: false,
    message: "Comment Posted Successfully",
    postId: post,
    redirect: "/",
    data: null,
  });
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
      routeLog(req, "Comment Deleted Successfully");
    } catch (error) {
      res.json({
        error: true,
        message: "Comment Deletion Failed",
        commentId: req.params.commentId,
      })
      routeLog(req, "Comment Deletion Failed", "error");
    }
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      commentId: req.params.commentId,
    });
    routeLog(req, "Wrong Secret", "error");
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
    routeLog(req, "Comment Detail Retrieved Successfully");
  } catch (error) {
    res.json({
      error: true,
      message: "Comment Detail Retrieval Failed",
      commentId: req.params.commentId,
    });
    routeLog(req, "Comment Detail Retrieval Failed", "error");
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


