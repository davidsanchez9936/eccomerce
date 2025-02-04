"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;
var orderSchema = new mongoose.Schema({
  products: [{
    product: {
      type: ObjectId,
      ref: "Product"
    },
    count: Number,
    colors: String
  }],
  paymentIntent: {},
  orderStatus: {
    type: String,
    "default": "Not Processed",
    "enum": ["Not Processed", "Cash On Delivery", "Processing", "Dispatched", "Cancelled", "Completed"]
  },
  orderdBy: {
    type: ObjectId,
    ref: "User"
  }
}, {
  tumestamps: true
});
module.exports = mongoose.model("Order", orderSchema);