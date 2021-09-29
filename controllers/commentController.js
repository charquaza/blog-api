var Comment = require('../models/comment');
var { body, validationResult } = require('express-validator');

exports.getAll = function (req, res, next) {
    Comment.find(filter)
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
        if (!req.user) {
            res.status(401).json({ errors: ['Please log in first'] });
        } else {
            next();
        }
    },

    //validate input
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            var comment = new Comment(
                {
                    author: req.user,
                    timestamp: Date.now(),
                    content: req.body.content,
                }
            );

            Comment.save(function (err, comment) {
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
        if (!req.user) {
            return res.status(401).json({ errors: ['Please log in first'] });
        } else if (req.user.is_admin) {
            return next();
        } else {
            Comment.findById(req.params.id, function (err, comment) {
                if (err) {
                    return next(err);
                }
    
                if (req.user._id === comment.author) {
                    next();
                } else {
                    res.status(403).json({ errors: ['You must be an admin or the author to update this comment'] });
                }
            });
        }
    },

    //validate input
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            var comment = new Comment(
                {
                    author: req.user,
                    timestamp: Date.now(),
                    content: req.body.content,
                    _id: req.params.id
                }
            );

            Comment.findByIdAndUpdate(function (err, comment) {
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

exports.delete = function (req, res, next) {
    //allow delete if user is admin or author
    
    if (!req.user) {
        return res.status(401).json({ errors: ['Please log in first'] });
    } 

    Comment.findById(req.params.id, function (err, comment) {
        if (err) {
            return next(err);
        }

        if (req.user._id !== comment.author || !req.user.is_admin) {
            return res.status(403).json({ errors: ['You must be an admin or the author to delete this comment'] });
        } 

        Comment.findByIdAndDelete(function (err, comment) {
            if (err) {
                return next(err);
            }

            if (comment === null) {
                res.status(404).json({ errors: ['Comment not found'] });
            } else {
                res.json({ data: comment });
            }
        });
    });
};