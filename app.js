
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

const app = express();

/*
    import routes
*/
import productRoute from './api/routes/products';
import orderRoute from './api/routes/orders';

/*
    connect to mongoDB
*/
mongoose.connect(
    `mongodb+srv://node-rest-shop:${process.env.DB_PASSWORD}@node-rest-shop-kmbhr.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

/*
    initialize app middlewares
*/
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/*
    bootstrap available routes
*/
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/uploads', express.static('uploads'));

/*
    code block if no route available
*/
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

/*
    error handling
*/
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;