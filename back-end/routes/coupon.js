const express = require("express")
const router = express.Router()

//middlewares
const {
    authCheck,
    adminCheck
} = require("../middlewares/auth.js")

//controller
const {
    create,
    remove,
    list
} = require("../controllers/coupon.js")

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
router.delete("/coupons/:couponId", authCheck, adminCheck, remove)

module.exports = router