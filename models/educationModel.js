
import mongoose, { Mongoose } from "mongoose"

const educationModel= new mongoose.Schema({
    school:{
        type:String,
        default:""
    },
   degree:{
       type:String,
       default:""
   },
   fieldofstudy:{
       type:String,
       default:""
   },
   startdate:{
       type:String,
        default:""
   },
   enddate:{
       type:String,
        default:""
   },
   grade:{
       type:String,
        default:""
   },
   activity:{
       type:String,
        default:""
   }
},{timestamps:true});

export const Education = mongoose.model("Education",educationModel);