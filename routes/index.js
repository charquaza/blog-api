var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//authentication routes
router.post('sign-up', function (req, res, next) {
});
router.post('log-in', function (req, res, next) {
});
router.post('log-out', function (req, res, next) {
});

//Posts routes
router.get('/posts', function (req, res, next) {
  //read all posts
});
router.post('/posts', function (req, res, next) {
  //create new post
});

router.get('/posts/:id', function (req, res, next) {
  //read one post
});
router.put('/posts/:id', function (req, res, next) {
  //update one post
});
router.delete('/posts/:id', function (req, res, next) {
  //delete one post
});

//Comments routes
router.get('/comments', function (req, res, next) {
  //read all comments
});
router.post('/comments', function (req, res, next) {
  //create new comment
});

router.get('/comments/:id', function (req, res, next) {
  //read one comment
});
router.put('/comments/:id', function (req, res, next) {
  //update one comment
});
router.delete('/comments/:id', function (req, res, next) {
  //delete one comment
});

module.exports = router;
