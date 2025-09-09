import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controller/userController.js"




let  userRouter = express.Router()

userRouter.get("/getCurrentUser", isAuth, getCurrentUser)



export default userRouter

