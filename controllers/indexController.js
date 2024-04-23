const express = require('express');
const asyncHandler = require('express-async-handler');
const marked = require('marked');
/* THIS FILE WILL CONTAIN NO ORM */

/* Index page GET */
exports.index_get = asyncHandler(async (req, res, next) => {
  const allPosts = await fetch('http://127.0.0.1:3000/api/post').then(data => data.json());
  if (allPosts.error === false) {
    res.render('index', {
      title: "Billy's Blog",
      posts: allPosts.data.posts,
      comments: allPosts.data.comments,
    });
  } else {
    res.render('error', {
      message: "Problem retrieving posts",
      error: {
        status: null,
        stack: "index",
      }
    });
  }
});

/* Create post page GET */
exports.create_get = (req, res, next) => {
  res.render('post', {
    title: "Billy's Blog",
  });
};

/* Create post page POST */
exports.create_post = asyncHandler(async (req, res, next) => {
  const [secret, title, body] = [req.body.secret, req.body.title, req.body.body];
  const apiEndpoint = await fetch('http://127.0.0.1:3000/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: secret,
      body: body,
      title: title,
    }),
  })
  .then( data => data.json() );
  if (apiEndpoint.error) {
    res.render('error', {
      message: apiEndpoint.message,
      error: {
        status: "",
        stack: "",
      }
    });
  } else {
    res.redirect('/');
  }
});

/* GET: Post Detail */
exports.detail_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const postData = await fetch(`http://127.0.0.1:3000/api/post/${postId}`)
  .then( data => data.json() )
  .catch( error => {
    });
  if (postData.error === true) {
    console.log(postData);
    res.render('error', {
      message: "Unable to fetch post details",
      error: {
        staus: "",
        stack: "",
      }
    });
  } else {
    res.render('detail', {
      post: postData.data.post,
      comments: postData.data.comments,
    });
  }
});

/* DELETE Post */
exports.delete_post = asyncHandler(async (req, res, next) => {
  const secret = req.body.secret;
  const result = await fetch(`http://127.0.0.1:3000/api/post/${req.params.postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: secret,
    }),
  })
  .then( data => data.json() )
  .catch( error => {
      res.render('error', {
        message: "Could not delete post",
        error: {
          status: null,
          stack: "indexController: delete_post",
        }
      });
    });
  if (result.error === true) {
    console.log("result block");
    res.render('error', {
      message: "Could not delete post",
      error: {
        status: null,
        stack: "indexController: delete_post",
      }
    })
  } else {
    res.redirect('/');
  }
});

/* GET Post: Update Post */
exports.create_update_get = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const result = await fetch(`http://127.0.0.1:3000/api/post/${postId}`)
    .then( data => data.json() );
  console.log(result);
  if (result.error === true) {
    res.render('error', {
      message: "Error retrieving post for update",
      error: {
        status: null,
        stack: "indexController: create_update_get"
      }
    })
  } else {
    res.render('post', {
      post: result.data.post,
    });
  }
});

/* PUT Post: Process Post Update PUT request */
exports.update_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const result = await fetch(`http://127.0.0.1:3000/api/post/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: req.body.title,
      body: req.body.body,
      secret: req.body.secret,
    }),
  })
  .then( data => data.json() );
  if (result.error === true) {
    res.rendere('error', {
      message: "Error updating post",
      error: {
        status: null,
        stack: "indexController: update_post",
      }
    })
  } else {
    res.redirect(result.redirect);
  }
});

/* Create Comment */
exports.create_comment = asyncHandler(async (req, res, next) => {
  const commentData = {
    postId: req.body.postId,
    author: req.body.author,
    body: req.body.body,
  };
  console.log("Comment Data", commentData);
  const newComment = await fetch("http://127.0.0.1:3000/api/comment", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  })
  .then( data => data.json() );
  if (newComment.error === true) {
    res.render('error', {
      message: "Error Posting Comment",
      error: {
        status: null,
        stack: "indexController",
      }
    });
  } else {
    res.redirect('/');
  }
});

/* Delete Comment */
exports.delete_comment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const secret = req.body.secret;
  const data = {
    secret: secret,
  }
  const result = await fetch(`http://127.0.0.1:3000/api/comment/${commentId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then( data => data.json() )
  .catch( error => {
      console.error("Error deleting comment: indexController: delete_comment log: ", error);
      res.send("Error deleting comment");
    })
  if (result.error === true) {
    res.render('error', {
      message: result.message,
      error: {
        status: null,
        stack: "indexController: delete_comment",
      }
    })
  } else {
    res.redirect(result.redirect);
  }
});

// Error Structure
// {
//   message: message,
//   error: {
//     status: status,
//     stack: stack,
//   },
// }
