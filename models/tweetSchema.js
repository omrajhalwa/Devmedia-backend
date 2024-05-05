import mongoose from "mongoose";


const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
   
    like:{
        type:Array,
        default:[]
        
    },
    bookmark:{
      type:Array,
      default:[]
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    userDetails:[],
    comments:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Tweet"
    }],
    repliedto:{
      type:String,
      default:""
    }
    
  


},{timestamps:true});

export const Tweet = mongoose.model("Tweet",tweetSchema);