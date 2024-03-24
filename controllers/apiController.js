const express = require('express');
const asyncHander = require('express-async-handler');

/* API page GET */
exports.api_get = asyncHander(async (req, res, next) => {
  res.json({
    title: "Billy's Blog",
    content: "/api/ GET route not yet implemented",
  });
});

/* API page POST */
exports.api_post = asyncHander(async (req, res, next) => {
  res.send(req.body);
});

