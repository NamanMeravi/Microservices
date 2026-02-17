import express from 'express'
import dotenv from 'dotenv'
import { startSendOTP } from './consumer.js';

dotenv.config()

startSendOTP()

const app = express();



const PORT = process.env.PORT || 4000

app.listen( PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})