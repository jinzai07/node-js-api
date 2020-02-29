const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//routes
const productRoutes = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

mongoose.connect(
    'mongodb+srv://node-rest-shop:biancak33@node-rest-shop-kmbhr.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//avail routes
app.use('/products', productRoutes);
app.use('/orders', orderRoute);

//code block if no route
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//err handling block
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log(process.env.MONGO_ATLAS_PW);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;