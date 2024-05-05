import mongoose from "mongoose";


import dotenv from "dotenv";

dotenv.config({
    path:"../config/.env"
})


const databaseConnection=async ()=>{
  await  mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to mongodb");
    }).catch((err)=>{
        console.log("error in connection with mongodb");
    })
}


export default databaseConnection;