import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/user';

const router = express.Router();

/*
    GET users
*/
router.get('/', (req, res, next) => {
    User.find()
    .select('_id email password')
    .exec()
    .then(users => {
        if (users.length) {
            res.status(200).json({
                users: users
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
})

/*
    Register new user
*/
router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length) {
            return res.status(422).json({
                message: 'Email already registered!'
            })
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save()
            .then((createdUser) => {
                res.status(201).json({
                    created: createdUser,
                    message: 'User created!'
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        })
    })
})

/*
    user login
*/
router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email})
    .exec()
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: 'Auth failed!'
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    error: err
                });
            };
            if (result) {
                //create token for user
                const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                    process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    message: 'Auth successful!',
                    token: token
                });
            } else {
                res.status(401).json({
                    message: 'Auth failed!'
                });
            }
        })
    })
})


/*
    Delete user
*/
router.delete('/:userId', (req, res, next) => {
    User.findByIdAndRemove(req.params.userId)
    .exec()
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "Given user ID not found!"
            });
        }
        res.status(200).json({
            message: 'User deleted!'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
})



export default router;