import bcrypt from 'bcrypt';
import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user';

const router = express.Router();

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