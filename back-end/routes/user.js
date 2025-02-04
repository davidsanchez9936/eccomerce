const express = require("express")

const router = express.Router()

const {
    authCheck,
} = require("../middlewares/auth.js")

const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders,
    addToWishList,
    wishlist,
    removeFromWishlist,
    createCashOrder
} = require("../controllers/user.js")

router.post("/user/cart", authCheck, userCart); //save card
router.get("/user/cart", authCheck, getUserCart)
router.put("/user/cart", authCheck, emptyCart)
router.post("/user/address", authCheck, saveAddress)

router.post('/user/order', authCheck, createOrder);
router.post('/user/cash-order', authCheck, createCashOrder);
router.get("/user/orders", authCheck, orders)

//coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart)

// wishlist
router.post("/user/wishlist", authCheck, addToWishList);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);


/* router.get("/user", (req, res) => {
    res.json({
        data: "user"
    })
}) */


module.exports = router