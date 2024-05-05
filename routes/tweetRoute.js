
import express from "express";
// import { Login, Logout, Register } from "../controllers/userController.js";
 import { bookmark, createTweet, deleteTweet, getAllTweet, getFollowingTweets, likeOrDislike } from "../controllers/tweetController.js";
 import { isAuthenticated } from "../config/auth.js";

 import multer from 'multer';
 import{v2 as cloudinary} from 'cloudinary';
 import { CloudinaryStorage } from 'multer-storage-cloudinary';
 import dotenv from "dotenv";
 dotenv.config({
    path:".env"
})
 

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

const router=express.Router();

router.route("/create").post(isAuthenticated,upload.single('file'),createTweet);
router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route("/bookmark/:id").put(isAuthenticated,bookmark);
router.route("/alltweet/:id").get(isAuthenticated,getAllTweet);
router.route("/followingtweet/:id").get(isAuthenticated,getFollowingTweets);
export default router;