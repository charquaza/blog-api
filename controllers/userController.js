var User = require('../models/user');
var { body, validationResult } = require('express-validator'); 
var passport = require('passport');
var jwt = require('jsonwebtoken');

//check login status first
//signup and login - create JWT token and provide to client

exports.signUp = [
    body('first_name').trim().notEmpty().withMessage('First name must not be empty')
        .isLength({ max: 100 }).withMessage('First name must not be more than 100 characters')
        .escape(),
    body('last_name').trim().notEmpty().withMessage('Last name must not be empty')
        .isLength({ max: 100 }).withMessage('Last name must not be more than 100 characters')
        .escape(),
    body('username').trim().notEmpty().withMessage('Username must not be empty')
        .isLength({ max: 100 }).withMessage('Username must not be more than 100 characters')
        .not().matches(/[<>&'"/]/).withMessage('Username must not contain the following characters: <, >, &, \', ", /')
        .bail().custom(function (username) {
            //check for uniqueness of username
            return new Promise(function (resolve, reject) {
                User.findOne({ username }, function (err, user) {
                    if (err) {
                        reject(err);
                    }

                    if (user !== null) {
                        reject('Username already exists; please enter a different username');
                    }
    
                    resolve();
                });
            });
        }),
    body('password').notEmpty().withMessage('Password must not be empty')
        .isLength({ max: 100 }).withMessage('Password must not be more than 100 characters')
        .not().matches(/[<>&'"/]/).withMessage('Password must not contain the following characters: <, >, &, \', ", /'),
    body('confirm_password').custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match').escape(),

    function (req, res, next) {
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            var user = new User(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 10)
                }
            );

            User.save(function (err, user) {
                if (err) {
                    return next(err);
                }

                req.login(user, { session: false }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    //encode entire user object?
                    var token = jwt.sign(user, process.env.JWT_SECRET);

                    res.json({ user, token });
                })(req, res, next);
            });
        }
    }
];

exports.logIn = function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.json({ errors: [info.message] });
        } else {
            req.login(user, { session: false }, function (err) {
                if (err) {
                    return next(err);
                }
    
                //encode entire user object?
                var token = jwt.sign(user, process.env.JWT_SECRET);
    
                res.json({ user, token });
            })(req, res, next);
        }
    })(req, res, next);
};

exports.logOut = function (req, res, next) {
    req.logout();
    res.json({ message: 'Logout successful' });
};


