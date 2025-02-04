"use strict";

var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;
var userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    "default": "subscriber"
  },
  cart: {
    type: Array,
    "default": []
  },
  address: String,
  wishlist: [{
    type: ObjectId,
    ref: "Product"
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("User", userSchema);