import express from "express";
import { loginUser, userRegister } from "../controllers/auth.controller.js";

import uploadFile from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", uploadFile, userRegister);
router.post("/login", loginUser);

export default router;
