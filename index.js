import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import databaseConnection from "./config/database.js";
import userRoutes from "./routes/userRoute.js"
import tweetRoutes from "./routes/tweetRoute.js"
import messageRoutes from "./routes/messageRoute.js"

import {app,server} from "./socket/socket.js"

dotenv.config({
    path:".env"
})



const corsOptions={
    origin:"http://localhost:3000",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"]
}
app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());
app.use(cookieParser());




app.use("/api/v1/user",userRoutes);
app.use("/api/v1/tweet",tweetRoutes);
app.use("/api/v1/message",messageRoutes);

app.get("/",(req,res)=>{
    res.send("server start");
})


server.listen(process.env.PORT,()=>{
    databaseConnection();
    console.log(`server listen at port ${process.env.PORT}`);
})