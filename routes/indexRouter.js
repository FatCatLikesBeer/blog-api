const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const asyncHander = require('express-async-handler');

/* GET home page. */
router.get('/', indexController.index_get);

/* Page for creating a post */
router.get('/create', (req, res, next) => {
  res.render('post', {
    title: "Billy's Blog",
  });
});

/* Dedicated page for handling errors */
router.get('/error', (req, res, next) => {
  res.render('error', {
    message: "Nondescript error.",
    error: {
      status: "You did something wrong.",
      stack: undefined,
    }
  });
});

module.exports = router;
