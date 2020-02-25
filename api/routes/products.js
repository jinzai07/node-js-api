const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find().exec()
    .then((products) => {
        if (products.length >= 0) {
            res.status(200).json({
                data: products
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
    .then((createdProduct) => {
        res.status(201).json({
            message: 'POST request to /products',
            product: createdProduct
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });


})

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    const product = Product.findById(id);

    Product.findById(id)
    .exec()
    .then((product) => {
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({
                message: 'Not found for provided ID'
            })
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
    });
})

router.patch('/:productId', async (req, res, next) => {
    const product = await Product.findById(req.params.productId).exec();
    if (!product) {
        return res.status(404).json({
            error: 'Product with given ID was not found'
        });
    }

    //only patch values that values are changed
    //dont edit whole object
    let query = { $set: {} };
    for (let key in req.body) {
        if (product[key] && product[key] !== req.body[key]) {
            query.$set[key] = req.body[key];
        }
    }
    await Product.updateOne({ _id: req.params.productId }, query).exec()
    .then((response) => {
        res.status(200).json(response)
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    })
})

router.delete('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    const productTodelete = await Product.findById(id).exec();

    if (!productTodelete) {
        return res.status(404).json({
            error: 'Product with given ID is not found on server'
        });
    }

    Product.remove({
        _id: id
    })
    .exec()
    .then((response) => {
        res.status(200).json(response);
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    })

})
module.exports = router;