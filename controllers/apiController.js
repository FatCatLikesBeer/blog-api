const express = require('express');
const asyncHandler = require('express-async-handler');
const PostModel = require('../models/postSchema.js');
const CommentModel = require('../models/commentSchema.js');
const marked = require('marked');

const apiLog = (req, message, state) => {
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
    apiLog(req, "Problem retrieving posts/comments from ORM", "error");
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
      body: marked.parse(comment.body),
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
  apiLog(req, "Posts & Comments Retrieved Successfully");
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
      apiLog(req, "Post request lacks title & body!", "error")
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
    apiLog(req, "Article Posted Successfully");
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: null,
    });
    apiLog(req, "Wrong secret", "error");
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
    apiLog(req, "Article Updated Successfully");
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: post._id,
    });
    apiLog(req, "Wrong Secret", "error");
  }
});

/* Delete an existing post */
exports.api_post_delete = asyncHandler(async (req, res, next) => {
  const secret = req.body.secret;
  const postId = req.params.postId;
  if (secret === process.env.BLOG_SECRET) {
    const condition = { post: postId };
    await CommentModel.deleteMany(condition);
    await PostModel.findByIdAndDelete(postId);
    apiLog(req, "Post and/or Comments Deleted Successfully")
    res.json({
      error: false,
      message: "Post and/or Comment Deleted Successful",
      redirect: "/",
    });
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      postId: postId,
    })
    apiLog(req, "Unauthorized", error);
  };
});

/* Get post detail */
exports.api_post_detail = asyncHandler(async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).exec();
    const comments = await CommentModel.find({ post: req.params.postId }).sort({ timeStamp: -1 }).exec();
    const parsedPost = {
      title: post.title,
      body: marked.parse(post.body),
      author: post.author,
      _id: post._id,
      date: post.date,
      url: post.url,
      type: post.type,
      originalBody: post.body,
    }
    const parsedComments = comments.map( comment => {
      const result = {
        post: comment.post,
        _id: comment._id,
        body: marked.parse(comment.body),
        author: comment.author,
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
    apiLog(req, "Post Retrieved Successfully")
  } catch (error) {
    console.log(error);
    res.json({
      error: true,
      message: "Post Retrieval Failed",
      postId: req.params.postId,
    });
    apiLog(req, "Post Retrieval Failed", "error");
  }
});

////// ------ COMMENT APIs ------ //////
/* Create a new comment */
exports.api_comment_create = asyncHandler(async (req, res, next) => {
  const [postId, body, author] = [req.body.postId, req.body.body, req.body.author];
  const newComment = new CommentModel({
    post: postId,
    body: body,
    author: author,
  });
  await newComment.save()
  .then( savedComment => {
    console.log("Comment Saved: ", savedComment);
    apiLog(req, "Comment Saved");
  })
  .catch( error => {
    apiLog(req, "Comment Posting Failed", "error");
    console.error(error);
    res.json({
      error: true,
      message: "Comment Posting Failed",
      postId: postId,
    });
  });
  res.json({
    error: false,
    message: "Comment Posted Successfully",
    postId: postId,
    redirect: "/",
    data: null,
  });
});

/* Delete a comment */
exports.api_comment_delete = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const secret = req.body.secret;
  if (secret === process.env.BLOG_SECRET) {
    const comment = await CommentModel.findById(commentId).exec()
    .catch( error => {
        console.error("Delete Comment: Error finding comment to delete", error);
        res.json({
          error: true,
          message: "Delete Comment: Error finding comment to delete",
          redirect: null,
        });
      });
    const post = await PostModel.findById(comment.post).exec()
    .catch( error => {
        console.error("Delete Comment: Error finding comment's parent post", error);
        res.json({
          error: true,
          message: "Delete Comment: Error finding comment's parent post",
          redirect: null,
        });
      });
    await CommentModel.findByIdAndDelete(commentId);
    res.json({
      error: false,
      message: "Comment Deleted Successfully",
      redirect: post.url,
      data: null,
    })
  } else {
    res.json({
      error: true,
      message: "Unauthorized",
      commentId: req.params.commentId,
    })
  };

  // if (secret === process.env.BLOG_SECRET) {
  //   try {
  //     const comment = await CommentModel.findById(req.params.commentId).exec();
  //     const post = await PostModel.findById(comment.post).exec();
  //     await CommentModel.findByIdAndDelete(req.params.commentId);
  //     res.json({
  //       error: false,
  //       message: "Comment Deleted Successfully",
  //       commentId: req.params.commentId,
  //       redirect: post.url,
  //       data: null,
  //     })
  //     apiLog(req, "Comment Deleted Successfully");
  //   } catch (error) {
  //     res.json({
  //       error: true,
  //       message: "Comment Deletion Failed",
  //       commentId: req.params.commentId,
  //     })
  //     apiLog(req, "Comment Deletion Failed", "error");
  //   }
  // } else {
  //   res.json({
  //     error: true,
  //     message: "Unauthorized",
  //     commentId: req.params.commentId,
  //   });
  //   apiLog(req, "Wrong Secret", "error");
  // };
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
    apiLog(req, "Comment Detail Retrieved Successfully");
  } catch (error) {
    res.json({
      error: true,
      message: "Comment Detail Retrieval Failed",
      commentId: req.params.commentId,
    });
    apiLog(req, "Comment Detail Retrieval Failed", "error");
  };
});

/* Logger */
exports.api_logger = asyncHandler(async (req, res, next) => {
  res.json({
    author: req.body.author,
    body: req.body.body,
    post: req.body.postId,
  });
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


