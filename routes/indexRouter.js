const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get('/', indexController.index_get);

/* POST home page redirect */
router.get('/post', (req, res, next) => {res.redirect('/')});

/* Page for creating a post */
router.get('/create', indexController.create_get);

/* Page for submitting a post */
router.post('/create', indexController.create_post);

/* Route for submitting a comment */
router.post('/create/comment', indexController.create_comment);

/* Route for Post Detail */
router.get('/post/:postId', indexController.detail_post);

// /* Route to Delete Post */
// router.delete('/:postId', indexController.delete_post);
//
// /* Route to update post */
// router.put('/:postId', indexController.update_post);

/* Dedicated page for handling errors */
router.get('/error', (req, res, next) => {
  let message = "Nondescript error.";
  if (req.body.error) { message = req.body.error };
  res.render('error', {
    message: message,
    error: {
      status: "You did something wrong.",
      stack: undefined,
    }
  });
});

module.exports = router;
