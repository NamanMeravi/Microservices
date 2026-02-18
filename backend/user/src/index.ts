import express from 'express'
import dotenv from 'dotenv'
import { DbConnect } from './config/db.js'
import {createClient} from 'redis'
import userRoute from "./routes/user.route.js"
import { connectRabbitMQ } from './config/rabbitmq.js'
import cors from 'cors'
dotenv.config()

const app = express()
const port = process.env.PORT || 3333;



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

app.use(express.json());

app.use(cors());


app.use("/api/v1",userRoute);



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})