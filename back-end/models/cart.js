const mongoose = require("mongoose")
const {
    ObjectId
} = mongoose.Schema

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: ObjectId,
            ref: "Product"
        },
        count: Number,
        colors: String,
        Price: Number
    }],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderdBy: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamp: true
})

module.exports = mongoose.model("Cart", cartSchema)