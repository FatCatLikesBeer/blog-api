const express = require('express');
const router = express.Router();
const asyncHander = require('express-async-handler');
const apiController = require('../controllers/apiController');

/* GET API route */
router.get('/', apiController.api_get);

/* POST to API route */
router.post('/', apiController.api_post);

module.exports = router;
