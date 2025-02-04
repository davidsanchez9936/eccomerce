require("dotenv").config()

const mongoURL = `mongodb+srv://davidsanchez9936:${process.env.MONGODB}@eccomerce.rs9prel.mongodb.net/`

module.exports = {
    mongoURL
}

/* mongodb+srv://davidsanchez9936:hFJcqql16oTnervh@eccomerce.rs9prel.mongodb.net/ */