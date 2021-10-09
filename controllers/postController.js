var Post = require('../models/post');
var { body, validationResult } = require('express-validator');
var passport = require('passport');

exports.getAll = [
    //check user credentials
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            req.login(user, { session: false }, function (err) {
                return next(err);
            });
        })(req, res, next);
    },

    function (req, res, next) {
        //if user is admin, get all posts; else, only get published posts
        var filter = (req.user && req.user.is_admin) ? {} : { is_published: true };

        Post.find(filter)
            .populate('author', 'first_name last_name username')
            .sort('timestamp')
            .exec(function (err, postList) {
                if (err) {
                    return next(err);
                }

                res.json({ data: postList });
            });
    }
];

exports.create = [
    //allow new post if user is admin
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(401).json({ errors: ['Please log in first'] });
            } else if (!user.is_admin) {
                res.status(403).json({ errors: ['You must be an admin to create a new post'] });
            } else {
                req.login(user, { session: false }, function (err) {
                    return next(err);
                });
            }
        })(req, res, next);
    },

    //validate input
    body('title').trim().notEmpty().withMessage('Title must not be empty')
        .isLength({ max: 100 }).withMessage('Title must not be longer than 100 characters')
        .escape(),
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            var post = new Post(
                {
                    author: req.user._id,
                    timestamp: Date.now(),
                    title: req.body.title,
                    content: req.body.content,
                    is_published: (req.body.publish === undefined ? true : false)
                }
            );

            post.save(function (err, post) {
                if (err) {
                    return next(err);
                }

                res.json({ data: post });
            });
        }
    }
];

exports.getById = [
    //check user credentials
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }
 
            req.login(user, { session: false }, function (err) {
                return next(err);
            });
        })(req, res, next);
    },

    function (req, res, next) {
        Post.findById(req.params.id)
            .populate('author', 'first_name last_name username')
            .exec(function (err, post) {
                if (err) {
                    return next(err);
                }

                if (post === null) {
                    res.status(404).json({ errors: ['Post not found'] });
                } else if (!post.is_published && (!req.user || !req.user.is_admin)) {   //show unpublished posts only if user is admin
                    res.status(404).json({ errors: ['Post not found'] });
                } else {
                    res.json({ data: post });
                }
            });
    }
];

exports.update = [
    //allow update if user is admin
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(401).json({ errors: ['Please log in first'] });
            } else if (!user.is_admin) {
                res.status(403).json({ errors: ['You must be an admin to update a post'] });
            } else {
                next();
            }
        })(req, res, next);
    },

    //validate input
    body('title').trim().notEmpty().withMessage('Title must not be empty')
        .isLength({ max: 100 }).withMessage('Title must not be longer than 100 characters')
        .escape(),
    body('content').trim().notEmpty().withMessage('Content must not be empty')
        .escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            var post = new Post(
                {
                    author: req.user,
                    timestamp: Date.now(),
                    title: req.body.title,
                    content: req.body.content,
                    is_published: (req.body.publish ? true : false),
                    _id: req.params.id
                }
            );

            Post.findByIdAndUpdate(req.params.id, post, function (err, post) {
                if (err) {
                    return next(err);
                }

                if (post === null) {
                    res.status(404).json({ errors: ['Post not found'] });
                } else {
                    res.json({ data: post });
                }
            });
        }
    }
];

exports.delete = [
    //allow delete if user is admin
    function (req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                res.status(401).json({ errors: ['Please log in first'] });
            } else if (!user.is_admin) {
                res.status(403).json({ errors: ['You must be an admin to delete a post'] });
            } else {
                next();
            }
        })(req, res, next);
    },

    function (req, res, next) {
        Post.findByIdAndDelete(req.params.id, function (err, post) {
            if (err) {
                return next(err);
            }

            if (post === null) {
                res.status(404).json({ errors: ['Post not found'] });
            } else {
                res.json({ data: post });
            }
        });
    }
];