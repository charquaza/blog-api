var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var postController = require('../controllers/postController');
var commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//authentication routes
//make routes RESTful?
router.post('/sign-up', userController.signUp);
router.post('/log-in', userController.logIn);
router.post('/log-out', userController.logOut);

//Posts routes
router.get('/posts', postController.getAll);
router.post('/posts', postController.create);

router.get('/posts/:id', postController.getById);
router.put('/posts/:id', postController.update);
router.delete('/posts/:id', postController.delete);

//Comments routes
router.get('/comments', commentController.getAll);
router.post('/comments', commentController.create);

router.get('/comments/:id', commentController.getById);
router.put('/comments/:id', commentController.update);
router.delete('/comments/:id', commentController.delete);

module.exports = router;
