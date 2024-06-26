const express = require('express');
const router = express.Router();
const asyncHander = require('express-async-handler');
const apiController = require('../controllers/apiController');

////// -------- POST ROUTES -------- //////
/* GET all content */
router.get('/post', apiController.api_get_all_content );

/* POST a new post */
router.post('/post', apiController.api_post_create);

/* Update a post */
router.put('/post/:postId', apiController.api_post_update);

/* Delete a post */
router.delete('/post/:postId', apiController.api_post_delete);

/* GET post detail */
router.get('/post/:postId', apiController.api_post_detail);


////// -------- COMMENT ROUTES -------- //////
/* POST a new comment */
router.post('/comment', apiController.api_comment_create);

/* DELETE a comment */
router.delete('/comment/:commentId', apiController.api_comment_delete);

/* GET comment detail */
router.get('/comment/:commentId', apiController.api_comment_detail);

/* Just Log Request */
router.post('/logger', apiController.api_logger);

module.exports = router;
