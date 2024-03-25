const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET
router.get('/', postController.post_get);

// POST
router.post('/', postController.post_post);

module.exports = router;
