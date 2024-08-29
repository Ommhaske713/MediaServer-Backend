import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 ,() =>{
        console.log("Listening on server ",process.env.PORT);
        app.on("error",(error)=>{
            console.log("Unable to connect ",error);

        })
    })
})
.catch((err) => {
    console.log("Connection failed !! ",err);
});