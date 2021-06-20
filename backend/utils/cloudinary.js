const config = require("config");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: config.get("cloudinaryCLOUDNAME"),
  api_key: config.get("cloudinaryAPIKEY"),
  api_secret: config.get("cloudinaryAPISECRET"),
});

module.exports = { cloudinary };
