import express from 'express'
import dotenv from 'dotenv'
import { DbConnect } from './config/db.js';
import chatroute from "../src/routes/chat.route.js"
const app = express();

 
const port = process.env.PORT
 

dotenv.config()
DbConnect();


app.use("/api/v1",chatroute);
 

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 })

