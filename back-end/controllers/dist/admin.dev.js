"use strict";

var User = require("../models/user.js");

var Order = require("../models/order.js"); // orders, orderStatus


exports.orders = function _callee(req, res) {
  var allOrders;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Order.find({}).sort("-createdAt").populate("products.product"));

        case 2:
          allOrders = _context.sent;
          res.json(allOrders);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.orderStatus = function _callee2(req, res) {
  var _req$body, orderId, orderStatus, updated;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          /* console.log(req.body)
          return */
          _req$body = req.body, orderId = _req$body.orderId, orderStatus = _req$body.orderStatus;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Order.findByIdAndUpdate(orderId, {
            orderStatus: orderStatus
          }, {
            "new": true
          }));

        case 3:
          updated = _context2.sent;
          res.json(updated);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};