const express = require('express');
const asyncHander = require('express-async-handler');
const post = require('../models/postSchema.js');

/* API page GET */
exports.index_get = asyncHander(async (req, res, next) => {
  res.render('index', {
    title: "Billy's Blog"
  });
});

/* API page POST */
exports.index_post = asyncHander(async (req, res, next) => {
  res.send("API home page PUST route not yet implemented");
});

/* API page PUT */
exports.index_put = asyncHander(async (req, res, next) => {
  res.send('API home page PUT route not yet implemented');
});

/* API page DELETE */
exports.index_delete = asyncHander(async (req, res, next) => {
  res.send('API home page DELETE route not yet implemented');
});

