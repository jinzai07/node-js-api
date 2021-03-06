import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import Product from '../models/product';

import checkAuth from '../middlewares/check-auth';

const router = express.Router();
/*
    initialize image upload config
*/
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads/'),
        filename: (req, file, cb) =>{
            let date = new Date().toISOString().replace(/:/g, '_');
            let imageName = file.originalname.replace(/\s/g, '-');
            cb(null, `${date}_${imageName}`);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Image uploaded should be in jpg/png format!'), false);
        };
    }
});

/*
    GET products
*/
router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then((products) => {
        if (products.length) {
            const response = {
                count: products.length,
                products: products.map(product => {
                        return {
                            name: product.name,
                            price: product.price,
                            id: product._id,
                            productImage: `http://localhost:3000/${product.productImage}`,
                            request: {
                                method: 'GET',
                                url: `http://localhost:3000/products/${product._id}`
                            }
                        }
                    }
                )
            }
            res.status(200).json(response);
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    })
})

/*
    POST product
*/
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path.replace(/\\/g, '/')
    });
    product.save()
    .then((createdProduct) => {
        res.status(201).json({
            message: 'Created product successfully',
            product: {
                name: createdProduct.name,
                price: createdProduct.price,
                _id: createdProduct._id,
                productImage: `http://localhost:3000/${createdProduct.productImage}`,
                request: {
                    method: 'GET',
                    url: `http://localhost:3000/products/${createdProduct._id}`
                }
            }
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
})

/*
    GET product by ID
*/
router.get('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((product) => {
        if (!product) {
            return res.status(404).json({
                message: 'Not found for provided ID'
            })
        }
        res.status(200).json({
            product: product,
            request: {
                method: 'GET',
                url: 'http://localhost:3000/products'
            }
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
    });
})

/*
    PATCH product
*/
router.patch('/:productId', checkAuth, (req, res, next) => {
    Product.findById(req.params.productId).exec()
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
        //only patch values that values are changed
        //dont edit whole object
        let query = { $set: {} };
        for (let key in req.body) {
            if (product[key] && product[key] !== req.body[key]) {
                query.$set[key] = req.body[key];
            }
        };
        Product.updateOne({ _id: req.params.productId }, query)
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Product edited successfully',
                request: {
                    method: 'GET',
                    url: `http://localhost:3000/products/${product._id}`
                }
            })
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    })
})

/*
    DEL product by ID
*/
router.delete('/:productId', checkAuth, (req, res, next) => {
    Product.findByIdAndRemove(req.params.productId)
    .exec()
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
        res.status(200).json({
            message: 'Product deleted!'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


export default router;