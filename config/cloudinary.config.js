const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: 'tati85',
    api_key: '255711655783144',
    api_secret: 'QUUQwbHpKXow3SpxAJpHMa6b-Tc'
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "images",
    allowedFormats: ["jpg", "png"],
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;