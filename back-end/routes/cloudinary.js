const express = require("express");
const router = express.Router();

//middlewares
const {
    authCheck,
    adminCheck
} = require("../middlewares/auth.js");

//controllers
const {
    upload,
    remove
} = require("../controllers/cloudinary.js");

router.post("/uploadImages", authCheck, adminCheck, upload);
router.delete("/removeimage/:public_id", authCheck, adminCheck, remove);

module.exports = router;