const cloudinary = require("cloudinary")

//config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//req.files.path
exports.upload = async (req, res) => {
    let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: "auto" //jpeg, png
    })
    res.json({
        public_id: result.public_id,
        url: result.secure_url
    })
}

exports.remove = async (req, res) => {
    let image_id = req.params.public_id;
    cloudinary.uploader.destroy(image_id).then(res => res.send("ok")).catch(err => res.json({
        success: false,
        err
    }))
};

/* exports.remove = async (req, res) => {
    try {
        let image_id = req.params.public_id;
        await cloudinary.uploader.destroy(image_id)
    } catch {

    }
}; */