import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { CreateChat } from "../controllers/Chat.controller.js";

const router = express.Router()

router.post("/create-chat",isAuth,CreateChat);


export default router;