import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    followers:{
        type:Array,
        default:[],
    },
    following:{
        type:Array,
        default:[],
    },
    bookmarks:{
        type:Array,
        default:[]
    },
    profilePhoto:{
        type:String,
        default:""
    },
    about:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    education:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Education"
    }],
    bookmarks:[
        {
            type:mongoose.Schema.Types.ObjectId,
                 ref:"Tweet"
        }
    ]


},{timestamps:true});

export const User = mongoose.model("User",userSchema);