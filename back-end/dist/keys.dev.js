"use strict";

require("dotenv").config();

var mongoURL = "mongodb+srv://davidsanchez9936:".concat(process.env.MONGODB, "@eccomerce.rs9prel.mongodb.net/");
module.exports = {
  mongoURL: mongoURL
};
/* mongodb+srv://davidsanchez9936:hFJcqql16oTnervh@eccomerce.rs9prel.mongodb.net/ */