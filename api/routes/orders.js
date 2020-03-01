const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product', '_id name price')
    .exec()
    .then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    order: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        method: 'GET',
                        url: `http://localhost:3000/orders/${order._id}`
                    }
                };
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .exec()
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product with given id not found!'
            });
        };
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then(createdOrder => {
        res.status(201).json({
            message: 'Order was created!',
            createdOrder: {
                quantity: createdOrder.quantity,
                _id: createdOrder._id,
                product: createdOrder.product
            },
            request: {
                method: 'GET',
                url: `http://localhost:3000/orders/${createdOrder._id}`
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product', '_id name')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not found!'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                method: 'GET',
                url: `http://localhost:3000/orders`
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', async (req, res, next) => {
    Order.findByIdAndRemove(req.params.orderId)
    .exec()
    .then(order => {
        if (!order) {
            res.status(404).json({
                message: 'Order not found!'
            });
        };
        res.status(200).json({
            message: 'Order deleted!'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;