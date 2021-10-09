var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var postController = require('../controllers/postController');
var commentController = require('../controllers/commentController');

//authentication routes
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
router.get('/posts/:postId/comments', commentController.getAll);
router.post('posts/:postId/comments', commentController.create);

router.get('/posts/:postId/comments/:commentId', commentController.getById);
router.put('/posts/:postId/comments/:commentId', commentController.update);
router.delete('/posts/:postId/comments/:commentId', commentController.delete);

module.exports = router;
