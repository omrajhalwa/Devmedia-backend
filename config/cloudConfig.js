


import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { v2 as CloudinaryStorage } from 'multer-storage-cloudinary';




cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,

});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'devmedia',
      allowedFormat: ["png","jpg","jpeg"],
     
    },
  });


  
const upload = multer({ storage: storage });
//   console.log("Cloudinary Config:", cloudinary.config());


  module.exports={
    cloudinary,
    storage,
    upload
  }