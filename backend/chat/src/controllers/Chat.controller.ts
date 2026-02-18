import TryCatch from "../config/Trycatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.js";



export const CreateChat = TryCatch(async(req:AuthenticatedRequest,res)=>{
         
    const userId = req.user?._id;

    const {otheruserID} = req.body;

    if(!otheruserID){
        res.status(400).json({
            message:"Other user ID is required"
        })
        return;
    }
    const existChat = await Chat.findOne({
        users:{$all:[userId,otheruserID], $size:2},
    });

    if(existChat){
        res.json({
            message:"Chat already exist",
            chatId:existChat._id,
        })
        return;
    }
    
    const newChat = await Chat.create({
        users:[userId, otheruserID]
    })

    res.status(201).json({
        message:"New Chat created",
        chatId:newChat._id
    })

})