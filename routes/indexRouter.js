const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index_get);

/* Page for creating a post */
router.get('/create', (req, res, next) => {
  res.render('post', {
    title: "Billy's Blog",
  });
});

module.exports = router;
