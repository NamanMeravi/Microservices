import { generateToken } from "../config/generateToken.js"
import { publishToQueue } from "../config/rabbitmq.js"
import TryCatch from "../config/Trycatch.js"
import { redisClient } from "../index.js"
import { User } from "../model/User.js"




export  const login = TryCatch(async(req,res)=>{
       const {email} = req.body

       const rateLimitKey = `otp:ratelimit:${email}`
       const rateLimit = await redisClient.get(rateLimitKey)
       if(rateLimit){
              res.status(429).json({
                     message:"Too many request. Please wait for requesting new otp"
              })

              return;
       }

       const otp = Math.floor(100000 + Math.random()*90000).toString()

       const otpKey = `otp:${email}`

       await redisClient.set(otpKey,otp,{
              EX:300,
       });

       await redisClient.set(rateLimitKey,"true",{
              EX:60
       });

       const message = {
              to:email,
              subject:"Your otp code",
              body:`Your OTP is ${otp}. It is valid for 5 miniute`
       }

       await publishToQueue("send-otp",message)

       res.status(200).json({
              message:"OTP SEND TO YOUR MAIL"
       })
       
})


export const verifyUser = TryCatch(async(req,res)=>{
     
       const {email, otp:enterOtp} = req.body;

       if(!email || !enterOtp){
              res.status(400).json({
                     message:"Email and OTP required"
              })
              return;
       }

       const otpKey =`otp:${email}`;

       const storedOTP = await redisClient.get(otpKey);

       if(!storedOTP || storedOTP!==enterOtp){
                res.status(400).json({
                     message:"Invalid OTP"
                })
                return;
       }

       await redisClient.del(otpKey);

       let user = await User.findOne({email});

       if(user){
              return res.status(500).json({
                     message:"User already exist"
              })
       }
       const name = email.slice(0,8);
       user = await User.create({name,email});

       const token = generateToken(user);

       res.status(200).json({
              message:"User verified",
              user,
              token
       })



})