const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
})

router.post('/', (req, res, next) => {
    const order = {
        orderId: req.body.orderId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Orders were created!',
        order: order
    });
})

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'get one order',
        orderId: req.params.orderId
    });
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted!'
    });
})




module.exports = router;