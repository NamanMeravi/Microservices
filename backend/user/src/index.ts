import express from 'express'
import dotenv from 'dotenv'
import { DbConnect } from './config/db.js'
import {createClient} from 'redis'
import userRoute from "./routes/user.route.js"
import { connectRabbitMQ } from './config/rabbitmq.js'

dotenv.config()

const app = express()

export const redisClient = createClient({
    url: process.env.REDIS_URL || "",

});

DbConnect();

connectRabbitMQ()

redisClient.connect().then(()=>{
    console.log("connected to redis");
    
}).catch((error)=>{
  console.log(error);
  
})

app.use("api/v1",userRoute);


const port = process.env.PORT || 3333;

app.listen(port,()=>{


    console.log(`server is running on port ${port}`);
})