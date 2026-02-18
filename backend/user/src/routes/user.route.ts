import express from 'express'
import { getAllUser, getUser, login, myProfile, updateName, verifyUser } from '../controllers/User.controller.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/login",login)
router.post("/verify",verifyUser)
router.get("/me",isAuth,myProfile);
router.get("/user/all",isAuth,getAllUser);
router.get("/user/:id",getUser);
router.post("/update/user",isAuth,updateName);

export default router;