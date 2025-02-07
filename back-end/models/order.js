const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const {
    ObjectId
} = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: ObjectId,
            ref: "Product"
        },
        count: Number,
        colors: String,
    }],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Cash On Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Completed"
        ]
    },
    orderdBy: {
        type: ObjectId,
        ref: "User"
    },
}, {
    tumestamps: true
})

module.exports = mongoose.model("Order", orderSchema)