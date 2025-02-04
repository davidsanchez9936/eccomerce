const Coupon = require("../models/coupon.js")

//create, remove, list

exports.create = async (req, res) => {
    try {

        const {
            name,
            expiry,
            discount
        } = req.body.coupon;
        res.json(await new Coupon({
            name,
            expiry,
            discount
        }).save())
    } catch (err) {
        console.log(err)
    }
}

exports.remove = async (req, res) => {
    try {
        // Eliminamos el 'new' ya que findByIdAndDelete es un método estático
        res.json(await Coupon.findByIdAndDelete(req.params.couponId))
    } catch (err) {
        console.log(err)
        // También es buena práctica enviar el error al cliente
        res.status(400).send("Delete coupon failed")
    }
}

exports.list = async (req, res) => {
    try {
        res.json(await Coupon.find({}).sort({
            createdAt: -1
        }))
    } catch (err) {
        console.log(err)
    }
}