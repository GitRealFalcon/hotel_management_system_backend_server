import { App } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config({ path: "./.env" });

connectDB()
.then(()=>{

    App.on("error", (error)=>{
        console.log("error",error);
        throw error
    })

    App.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running port : ${process.env.PORT || 8000}`);
        
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed",err);  
})