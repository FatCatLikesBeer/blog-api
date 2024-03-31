const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get('/', indexController.index_get);

/* Page for creating a post */
router.get('/create', indexController.create_get);

/* Page for sumbittim a post */
router.post('/create', indexController.create_post);

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
