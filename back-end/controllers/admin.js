const User = require("../models/user.js")
const Order = require("../models/order.js")

// orders, orderStatus

exports.orders = async (req, res) => {
    let allOrders = await Order.find({})
        .sort("-createdAt")
        .populate("products.product")

    res.json(allOrders)
}

exports.orderStatus = async (req, res) => {
    /* console.log(req.body)
    return */
    const {
        orderId,
        orderStatus
    } = req.body

    let updated = await Order.findByIdAndUpdate(
        orderId, {
            orderStatus
        }, {
            new: true
        }
    )
    res.json(updated)
}

