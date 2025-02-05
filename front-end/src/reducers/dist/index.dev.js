"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootReducer = void 0;

var _redux = require("redux");

var _userReducer = require("./userReducer.js");

var _searchReducer = require("./searchReducer.js");

var _cartReducer = require("./cartReducer.js");

var _drawerReducer = require("./drawerReducer.js");

var _couponReducer = require("./couponReducer.js");

var _CODReducer = require("./CODReducer.js");

var rootReducer = (0, _redux.combineReducers)({
  user: _userReducer.userReducer,
  search: _searchReducer.searchReducer,
  cart: _cartReducer.cartReducer,
  drawer: _drawerReducer.drawerReducer,
  coupon: _couponReducer.couponReducer,
  COD: _CODReducer.CODReducer
});
exports.rootReducer = rootReducer;