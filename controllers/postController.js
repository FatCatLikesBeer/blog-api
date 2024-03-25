const express = require('express');
const asyncHander = require('express-async-handler');
const post = require('../models/postSchema.js');

// GET
exports.post_get = (req, res, next) => {
  res.send('/post route GET');
};

// POST
exports.post_post = asyncHander(async (req, res, next) => {
  res.send('/post route POST');
});
