const express = require('express');
const asyncHandler = require('express-async-handler');
const marked = require('marked');
/* THIS FILE WILL CONTAIN NO ORM */

/* Index page GET */
exports.index_get = asyncHandler(async (req, res, next) => {
  const allPosts = await fetch('http://127.0.01:3000/api/post').then(data => data.json());
  res.render('index', {
    title: "Billy's Blog",
    posts: allPosts,
  });
});

/* Create post page GET */
exports.create_get = (req, res, next) => {
  res.render('post', {
    title: "Billy's Blog",
  });
};

/* Create post page POST */
exports.create_post = asyncHandler(async (req, res, next) => {
  const apiEndpoint = await fetch('http://127.0.01:3000/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
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

