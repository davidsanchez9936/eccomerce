"use strict";

var User = require("../models/user.js");

var Product = require("../models/product.js");

var Cart = require("../models/cart.js");

var Coupon = require("../models/coupon.js");

var Order = require("../models/order.js");

var uniqueid = require("uniqueid");

exports.userCart = function _callee(req, res) {
  var cart, products, user, cartExistByThisUser, i, productFromDb, object, cartTotal, newCart;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          cart = req.body.cart;
          products = [];
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Usuario no encontrado"
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Cart.findOne({
            orderdBy: user._id
          }));

        case 10:
          cartExistByThisUser = _context.sent;

          if (!cartExistByThisUser) {
            _context.next = 15;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(cartExistByThisUser.deleteOne());

        case 14:
          console.log("Carrito anterior eliminado");

        case 15:
          i = 0;

        case 16:
          if (!(i < cart.length)) {
            _context.next = 28;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(Product.findById(cart[i]._id).select("price"));

        case 19:
          productFromDb = _context.sent;

          if (productFromDb) {
            _context.next = 23;
            break;
          }

          console.log("Producto no encontrado: ".concat(cart[i]._id));
          return _context.abrupt("continue", 25);

        case 23:
          object = {
            product: cart[i]._id,
            count: cart[i].count,
            color: cart[i].color,
            price: productFromDb.price
          };
          products.push(object);

        case 25:
          i++;
          _context.next = 16;
          break;

        case 28:
          cartTotal = products.reduce(function (total, product) {
            return total + product.price * product.count;
          }, 0);
          _context.next = 31;
          return regeneratorRuntime.awrap(Cart.create({
            products: products,
            cartTotal: cartTotal,
            orderdBy: user._id
          }));

        case 31:
          newCart = _context.sent;
          console.log("Nuevo carrito --> ", newCart);
          res.json({
            ok: true,
            cart: newCart
          });
          _context.next = 40;
          break;

        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](0);
          console.error("Error al crear el carrito:", _context.t0);
          res.status(500).json({
            error: "No se pudo crear el carrito",
            details: _context.t0.message
          });

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 36]]);
};

exports.getUserCart = function _callee2(req, res) {
  var user, cart, products, cartTotal, totalAfterDiscount;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 2:
          user = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Cart.findOne({
            orderdBy: user._id
          }).populate("products.product", "_id color title price totalAfterDiscount"));

        case 5:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.json({
            products: [],
            cartTotal: 0,
            totalAfterDiscount: 0
          }));

        case 8:
          products = cart.products, cartTotal = cart.cartTotal, totalAfterDiscount = cart.totalAfterDiscount;
          res.json({
            products: products,
            cartTotal: cartTotal,
            totalAfterDiscount: totalAfterDiscount
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.emptyCart = function _callee3(req, res) {
  var user, cart;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 2:
          user = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Cart.findOneAndDelete({
            orderdBy: user._id
          }));

        case 5:
          cart = _context3.sent;
          res.json(cart);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.saveAddress = function _callee4(req, res) {
  var userAddress;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.user.email
          }, {
            address: req.body.address
          }));

        case 2:
          userAddress = _context4.sent;
          res.json({
            ok: true,
            userAddress: userAddress
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.applyCouponToUserCart = function _callee5(req, res) {
  var coupon, validCoupon, user, cart, cartTotal, totalAfterDiscount;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          coupon = req.body.coupon;
          console.log("COUPON", coupon); // Find valid coupon and handle if not found

          _context5.next = 5;
          return regeneratorRuntime.awrap(Coupon.findOne({
            name: coupon,
            expiry: {
              $gt: new Date()
            }
          }));

        case 5:
          validCoupon = _context5.sent;

          if (validCoupon) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.json({
            err: "Invalid coupon or coupon has expired"
          }));

        case 8:
          console.log("VALID COUPON", validCoupon); // Find the user

          _context5.next = 11;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 11:
          user = _context5.sent;
          _context5.next = 14;
          return regeneratorRuntime.awrap(Cart.findOne({
            orderdBy: user._id
          }).populate("products.product", "_id title price"));

        case 14:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", res.json({
            err: "No cart found"
          }));

        case 17:
          cartTotal = cart.cartTotal;
          console.log("cartTotal", cartTotal, "discount", validCoupon.discount); // Calculate total after discount

          totalAfterDiscount = (cartTotal - cartTotal * validCoupon.discount / 100).toFixed(2); // Update cart with new total

          _context5.next = 22;
          return regeneratorRuntime.awrap(Cart.findOneAndUpdate({
            orderdBy: user._id
          }, {
            totalAfterDiscount: totalAfterDiscount
          }, {
            "new": true
          }));

        case 22:
          res.json(totalAfterDiscount);
          _context5.next = 29;
          break;

        case 25:
          _context5.prev = 25;
          _context5.t0 = _context5["catch"](0);
          console.error("Error applying coupon:", _context5.t0);
          res.status(500).json({
            err: "Error applying coupon"
          });

        case 29:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

exports.createOrder = function _callee7(req, res) {
  var paymentIntent, user, _ref, products, validProducts, filteredProducts, newOrder, bulkOption, updated;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          paymentIntent = req.body.stripeResponse.paymentIntent;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 4:
          user = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(Cart.findOne({
            orderdBy: user._id
          }));

        case 7:
          _ref = _context7.sent;
          products = _ref.products;
          _context7.next = 11;
          return regeneratorRuntime.awrap(Promise.all(products.map(function _callee6(item) {
            var product;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(Product.findById(item.product._id));

                  case 2:
                    product = _context6.sent;
                    return _context6.abrupt("return", product ? item : null);

                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 11:
          validProducts = _context7.sent;
          // Filtrar productos válidos
          filteredProducts = validProducts.filter(function (product) {
            return product !== null;
          }); // Si no hay productos válidos, devolver un error

          if (!(filteredProducts.length === 0)) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            ok: false,
            message: "No valid products found in the cart"
          }));

        case 15:
          _context7.next = 17;
          return regeneratorRuntime.awrap(new Order({
            products: filteredProducts,
            paymentIntent: paymentIntent,
            orderdBy: user._id
          }).save());

        case 17:
          newOrder = _context7.sent;
          // decrement quantity, increment sold
          bulkOption = filteredProducts.map(function (item) {
            return {
              updateOne: {
                filter: {
                  _id: item.product._id
                },
                update: {
                  $inc: {
                    quantity: -item.count,
                    sold: +item.count
                  }
                }
              }
            };
          });
          _context7.next = 21;
          return regeneratorRuntime.awrap(Product.bulkWrite(bulkOption, {}));

        case 21:
          updated = _context7.sent;
          console.log("PRODUCT QUANTITY DECREMENTED AND SOLD++", updated);
          console.log("NEW ORDER SAVED", newOrder);
          res.json({
            ok: true,
            order: newOrder
          });
          _context7.next = 31;
          break;

        case 27:
          _context7.prev = 27;
          _context7.t0 = _context7["catch"](0);
          console.error("Error creating order:", _context7.t0);
          res.status(500).json({
            ok: false,
            message: "Error creating order",
            error: _context7.t0.message
          });

        case 31:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.orders = function _callee8(req, res) {
  var user, userOrders;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 3:
          user = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(Order.find({
            orderdBy: user._id
          }).populate({
            path: "products.product",
            match: {
              _id: {
                $exists: true
              }
            } // Solo poblar productos existentes

          }));

        case 6:
          userOrders = _context8.sent;
          // Filtrar órdenes con al menos un producto válido
          userOrders = userOrders.filter(function (order) {
            return order.products.some(function (product) {
              return product.product !== null;
            });
          });
          res.json(userOrders);
          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          console.error("Error fetching orders:", _context8.t0);
          res.status(500).json({
            error: "Failed to fetch orders",
            message: _context8.t0.message
          });

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // addToWishlist wishlist removeFromWishlist


exports.addToWishList = function _callee9(req, res) {
  var productId, user;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          productId = req.body.productId;
          console.log(productId);
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.user.email
          }, {
            $addToSet: {
              wishlist: productId
            }
          }));

        case 4:
          user = _context9.sent;
          res.json({
            ok: true
          });

        case 6:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.wishlist = function _callee10(req, res) {
  var list;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }).select("wishlist").populate("wishlist"));

        case 2:
          list = _context10.sent;
          res.json({
            list: list
          });

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
};
/* exports.wishlist = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })
            .select("wishlist")
            .populate("wishlist");

        res.json({
            wishlist: user.wishlist || []
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
}; */


exports.removeFromWishlist = function _callee11(req, res) {
  var productId, user;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          productId = req.params.productId;
          _context11.next = 3;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.user.email
          }, {
            $pull: {
              wishlist: productId
            }
          }));

        case 3:
          user = _context11.sent;
          res.json({
            ok: true
          });

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.createCashOrder = function _callee13(req, res) {
  var _req$body, COD, couponApplied, user, userCart, finalAmount, validProducts, filteredProducts, newOrder, bulkOption;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _req$body = req.body, COD = _req$body.COD, couponApplied = _req$body.couponApplied;

          if (COD) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", res.status(400).send("Create cash order failed"));

        case 4:
          _context13.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.user.email
          }));

        case 6:
          user = _context13.sent;
          _context13.next = 9;
          return regeneratorRuntime.awrap(Cart.findOne({
            orderdBy: user._id
          }));

        case 9:
          userCart = _context13.sent;

          if (!(!userCart || !userCart.products)) {
            _context13.next = 12;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            ok: false,
            message: "No cart found"
          }));

        case 12:
          console.log(userCart);
          finalAmount = 0;

          if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount * 100;
          } else {
            finalAmount = userCart.cartTotal * 100;
          } // Verificar productos existentes


          _context13.next = 17;
          return regeneratorRuntime.awrap(Promise.all(userCart.products.map(function _callee12(item) {
            var product;
            return regeneratorRuntime.async(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return regeneratorRuntime.awrap(Product.findById(item.product));

                  case 2:
                    product = _context12.sent;
                    return _context12.abrupt("return", product ? item : null);

                  case 4:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          })));

        case 17:
          validProducts = _context13.sent;
          filteredProducts = validProducts.filter(function (p) {
            return p !== null;
          });

          if (!(filteredProducts.length === 0)) {
            _context13.next = 21;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            ok: false,
            message: "No valid products found in cart"
          }));

        case 21:
          _context13.next = 23;
          return regeneratorRuntime.awrap(new Order({
            products: filteredProducts,
            paymentIntent: {
              id: uniqueid(),
              amount: finalAmount,
              currency: "usd",
              status: "Cash On Delivery",
              created: Date.now(),
              payment_method_types: ["cash"]
            },
            orderdBy: user._id,
            orderStatus: "Cash On Delivery"
          }).save());

        case 23:
          newOrder = _context13.sent;
          // Actualizar inventario
          bulkOption = filteredProducts.map(function (item) {
            return {
              updateOne: {
                filter: {
                  _id: item.product
                },
                update: {
                  $inc: {
                    quantity: -item.count,
                    sold: +item.count
                  }
                }
              }
            };
          });
          _context13.next = 27;
          return regeneratorRuntime.awrap(Product.bulkWrite(bulkOption, {}));

        case 27:
          res.json({
            ok: true,
            order: newOrder
          });
          _context13.next = 34;
          break;

        case 30:
          _context13.prev = 30;
          _context13.t0 = _context13["catch"](0);
          console.error("Error creating order:", _context13.t0);
          res.status(500).json({
            ok: false,
            message: "Error creating order",
            error: _context13.t0.message
          });

        case 34:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 30]]);
};