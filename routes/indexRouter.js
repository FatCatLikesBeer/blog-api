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

router.post('/create', asyncHander(async (req, res, next) => {
  const apiEndpoint = await fetch('http://127.0.01:3000/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  })
  .then( data => data.json() );
  if (apiEndpoint.error) {
    res.render('error', {
      message: apiEndpoint.message,
      error: {
        status: "",
        stack: "",
      }
    });
  } else {
    res.redirect('/');
  }
}));

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
