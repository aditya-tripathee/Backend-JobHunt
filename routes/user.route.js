import express from "express";
import { login, logout, regsiterUser, updateProfile } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();



router.post("/register",singleUpload,regsiterUser);
router.post("/login",login);
router.post("/logout",logout);
router.post("/profile/update",authenticateToken,updateProfile);

export default router;
