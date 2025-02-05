"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CODReducer = void 0;

var CODReducer = function CODReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case "COD":
      return action.payload;

    default:
      return state;
  }
};

exports.CODReducer = CODReducer;