import express from "express";
import { userRegister } from "../controllers/auth.controller.js";

import uploadFile from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", uploadFile, userRegister);

export default router;
