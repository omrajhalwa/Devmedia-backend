import { User } from "../models/userSchema.js";

import bcryptjs from "bcryptjs"

import jwt from "jsonwebtoken"
import { Education } from "../models/educationModel.js";





export const Register = async (req, res) => {


  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      //server side validation
      return res.status(401).json({
        message: "all field are required",
        success: false
      })
    }

    const user = await User.findOne({ email });

    if (user) {
      //if user already exists
      return res.status(401).json({
        message: "User are already exist",
        success: false
      })
    }
    //hashing and salting the password so that is cannot access by unauthorized user
    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword
    })

    return res.status(201).json({
      message: "Account Created Succefully",
      success: true
    })


  } catch (error) {
    console.log(error);
  }
}

/*login functionality...............................*/
export const Login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "all field are required",
        success: false
      })
    }

     console.time('emailfind');
    const user = await User.findOne({ email });
      console.timeEnd('emailfind');
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false
      })
    }
              console.time("bycrpyt");
    const isMatch = await bcryptjs.compare(password, user.password);
              console.timeEnd("bycrpyt"); 
    if (!isMatch) {

      return res.status(401).json({
        message: "Incorrect email or password",
        success: false
      })

    }

    const tokenData = {
      userId: user._id
    }
                console.time("jwtsign");
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
                console.timeEnd("jwtsign");

    return res.status(201).cookie("token", token, { expiresIn: '1d', httpOnly: true }).json({
      message: `Welcome back ${user.name}`,
      user,
      success: true
    })

  } catch (error) {
    console.log(error);
  }
}

/*logout functionality............................. */
export const Logout = async (req, res) => {
  return res.cookie("token", " ", { expiresIn: new Date(Date.now()) }).json({
    message: "user logged out successfully",
    success: true
  });


}

/*bookmark.................................. */
export const bookmarks = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if (user.bookmarks.includes(tweetId)) {
      //unsave
      await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
      return res.status(200).json({
        message: "Removed from bookmark"
      })
    } else {
      //save

      await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
      return res.status(200).json({
        message: "add from bookmark"
      })
    }
  } catch (error) {
    console.log(error);
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate(["education","bookmarks"]).select("-password");
    return res.status(200).json({
      user,
    })
  } catch (error) {
    console.log(error);
  }
}

export const getOtherUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
    if (!otherUsers) {
      return res.status(401).json({
        message: "currently don't have any user"
      })
    }

    return res.status(201).json({
      otherUsers
    })
  } catch (error) {

  }
}


export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already followed to ${user.name}`
      })
    }

    return res.status(200).json({
      message: `${loggedInUser.name} just follow to ${user.name}`,
      success: true
    })

  } catch (error) {
    console.log(error);
  }
}

export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User has not followed to ${user.name}`
      })
    }

    return res.status(200).json({
      message: `${loggedInUser.name} just unfollow to ${user.name}`,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return res.status(201).json(otherUsers);
  } catch (error) {
    console.log(error);
  }
}

export const editprofile = async (req, res) => {

  try {
    const { id } = req.params;
    console.log(req.body);
    let { about, name, username, description } = req.body;
    const loggedInUser = await User.findById(id);
    if (name === '') {
      name = loggedInUser?.name
    } if (username === '') {
      username = loggedInUser?.username
    } if (description === '') {
      description = loggedInUser?.description
    }if(about ===''){
      about=loggedInUser?.about
    }
    let image;
    if(req.file===undefined){
      image=loggedInUser?.profilePhoto;
    }else{
      image=req.file.path;
    }

    const user = await User.findByIdAndUpdate(id, { $set: { profilePhoto: image,name:name,username:username,description:description,about:about } });

    return res.status(201).json({
      message: "photo updated succefully",
      user,
      success: true
    })




  } catch (error) {
    console.log(error);
  }
}

export const addEducation = async (req, res) => {

  try {
    const { id,school,degree,fieldofstudy,startdate,enddate,grade,activity} = req.body;
    const education=await Education.create({
       school,
       degree,
       fieldofstudy,
       startdate,
       enddate,
       grade,
       activity
    })
    const user = await User.findById(id);
    
    user?.education?.push(education?._id);

    await user.save();

    return res.status(201).json({
      message: "Educaiton field added successfully",
      success: true
    })

  } catch (error) {
    console.log(error);
  }
}
