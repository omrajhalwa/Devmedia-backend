import express from "express"
import { Login, Logout, Register,addEducation,bookmarks, editprofile, follow, getAllUsers, getMyProfile, getOtherUsers, unfollow } from "../controllers/userController.js";
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

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated,bookmarks);
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated,getOtherUsers);
router.route("/follow/:id").post(isAuthenticated,follow);
router.route("/unfollow/:id").post(isAuthenticated,unfollow);
router.route("/getAllUser").get(isAuthenticated,getAllUsers);
router.route("/editprofile/:id").put(isAuthenticated,upload.single('file'),editprofile);
router.route("/add/education").post(isAuthenticated,addEducation);
export default router;