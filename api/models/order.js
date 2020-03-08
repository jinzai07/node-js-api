import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});


export default mongoose.model('Order', orderSchema);