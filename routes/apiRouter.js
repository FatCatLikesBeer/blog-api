const express = require('express');
const router = express.Router();
const asyncHander = require('express-async-handler');
const apiController = require('../controllers/apiController');

/* GET all content */
router.get('/post', apiController.api_get_all_content );

/* POST a new post */
router.post('/post', apiController.api_post_create);

/* Update a post */
router.put('/post/:postId', apiController.api_post_update);

/* Delete a post */
router.delete('/post/:postId', apiController.api_post_delete);

/* POST a new comment */
router.post('/post/:postId/comment', apiController.api_comment_create);

/* DELETE a comment */
router.delete('/post/:postId/comment/:commentId', apiController.api_comment_delete);

module.exports = router;
