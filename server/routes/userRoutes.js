import express from "express";
import { auth } from "../middlewares/auth.js";
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/userController.js";
import { deleteCreation } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations)
userRouter.get('/get-published-creations', auth, getPublishedCreations)
userRouter.post('/toggle-like-creation', auth, toggleLikeCreation)
userRouter.delete('/delete-creation/:id', auth, deleteCreation)

export default userRouter;