const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET request to /product'
    });
})

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'POST request to /products',
        product: product
    });
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    if (id === 'special') {
        res.status(200).json({
            message: 'You passed an special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Else clause'
        });
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted'
    })
})
module.exports = router;