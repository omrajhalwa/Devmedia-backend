import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";



export const createTweet= async(req,res)=>{
    try {
       
       // console.log(req.file);
      let {description,id,tweetId}=req.body;
       // console.log(req.body);
      

        if((description==='' &&!req.file) || !id){
            return res.status(401).json({
                message:"field are required",
                success:false
            });
        };

        let image=null ;
        if(req.file!=undefined){
            image=req.file.path;
        }
      

  const user= await User.findById(id).select("-password");

  const newTweet= await Tweet.create({
    description,
    userId:id,
    userDetails:user,
      image:image
});

  let tweet=null;
  if(tweetId!==undefined){
         tweet= await Tweet.findById(tweetId);
         if (!Array.isArray(tweet.comments)) {
            tweet.comments = [];
          }
          
          // Push the comment ID into the tweet's comments array
        if(tweet!==null)  tweet.comments.unshift(newTweet._id);
          
          // Save the updated tweet
          newTweet.repliedto=tweetId;
          await newTweet.save();
          await tweet.save();
  }

 
      

       

        return res.status(201).json({
            message:"Tweet Created succefully",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}


export const deleteTweet= async (req,res)=>{
    try {
        const {id}=req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"tweet deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}


export const likeOrDislike = async(req,res)=>{
    try {
        const loggedInUserId=req.body.id;
        const tweetId=req.params.id;
        const tweet= await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            //dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});

            return res.status(200).json({
                message:"User dislike your tweet",

            });
        }else{
            //like
            await Tweet.findByIdAndUpdate(tweetId,{$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User like your tweet",

            });
        }
    } catch (error) {
        console.log(error);
    }
}


export const bookmark = async(req,res)=>{
    try {
        const loggedInUserId=req.body.id;
        const tweetId=req.params.id;
        const tweet= await Tweet.findById(tweetId);
   
        if(tweet.bookmark.includes(loggedInUserId)){
            //dislike
            await User.findByIdAndUpdate(loggedInUserId,{$pull:{bookmarks:tweetId}});
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{bookmark:loggedInUserId}});

            return res.status(200).json({
                message:"User unmarked your tweet",

            });
        }else{
            //like
            await User.findByIdAndUpdate(loggedInUserId,{$push:{bookmarks:tweetId}});
            await Tweet.findByIdAndUpdate(tweetId,{$push:{bookmark:loggedInUserId}});
            return res.status(200).json({
                message:"User bookmarked your tweet",

            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const getAllTweet = async (req,res)=>{
    
  


    try {
        const id=req.params.id;
        const loggedInUser= await User.findById(id);
        const loggedInUserTweet= await Tweet.find({userId:id}).populate({
            path: 'comments', // Populate comments field within the tweet
          
          });
      
      

        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId)=>{
            return Tweet.find({userId:otherUserId}).populate({
                path: 'comments', // Populate comments field within the tweet
              })
        }));
        return res.status(200).json({
            tweets:loggedInUserTweet.concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error);
    }
}

export const getFollowingTweets= async (req,res)=>{
    try {
        const id=req.params.id;
        const loggedInUser= await User.findById(id);
       
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId)=>{
            return Tweet.find({userId:otherUserId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error);
    }
}