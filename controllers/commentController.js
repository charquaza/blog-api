var Comment = require('../models/comment');
var { body, validationResult } = require('express-validator');
var passport = require('passport');

exports.getAll = function (req, res, next) {
    //get all comments of a specific post
    Comment.find({ author: req.params.postId })
        .populate('author', 'first_name last_name username')
        .exec(function (err, commentList) {
            if (err) {
                return next(err);
            }

            res.json({ data: commentList });
        });
};

exports.create = [
    //allow new comment if user is signed in
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(401).json({ errors: ['Please log in first'] });
            } else {
                next();
            }
        })(req, res, next);
    },

    //validate input
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            var comment = new Comment(
                {
                    author: req.user,
                    timestamp: Date.now(),
                    content: req.body.content,
                }
            );

            comment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }

                res.json({ data: comment });
            });
        }
    }
];

exports.getById = function (req, res, next) {
    Comment.findById(req.params.id)
        .populate('author', 'first_name last_name username')
        .exec(function (err, comment) {
            if (err) {
                return next(err);
            }

            if (comment === null) {
                res.status(404).json({ errors: ['Comment not found'] });
            } else {
                res.json({ data: comment });
            }
        });
};

exports.update = [
    //allow update if user is admin or author
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ errors: ['Please log in first'] });
            } else if (user.is_admin) {
                return next();
            } else {
                //check if user is author of comment
                Comment.findById(req.params.id, function (err, comment) {
                    if (err) {
                        return next(err);
                    }
        
                    if (user._id === comment.author) {
                        next();
                    } else {
                        res.status(403).json({ errors: ['You must be an admin or the author to update this comment'] });
                    }
                });
            }
        })(req, res, next);
    },

    //validate input
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            var comment = new Comment(
                {
                    author: req.user,
                    timestamp: Date.now(),
                    content: req.body.content,
                    _id: req.params.id
                }
            );

            Comment.findByIdAndUpdate(req,params.id, comment, function (err, comment) {
                if (err) {
                    return next(err);
                }

                if (comment === null) {
                    res.status(404).json({ errors: ['Comment not found'] });
                } else {
                    res.json({ data: comment });
                }
            });
        }
    }
];

exports.delete = [
    //allow delete if user is admin or author
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ errors: ['Please log in first'] });
            } else if (user.is_admin) {
                return next();
            } else {
                //check if user is author of comment
                Comment.findById(req.params.id, function (err, comment) {
                    if (err) {
                        return next(err);
                    }
        
                    if (user._id === comment.author) {
                        next();
                    } else {
                        res.status(403).json({ errors: ['You must be an admin or the author to delete this comment'] });
                    }
                });
            }
        })(req, res, next);
    },

    function (req, res, next) {
        Comment.findByIdAndDelete(req.params.id, function (err, comment) {
            if (err) {
                return next(err);
            }

            if (comment === null) {
                res.status(404).json({ errors: ['Comment not found'] });
            } else {
                res.json({ data: comment });
            }
        });
    }
];