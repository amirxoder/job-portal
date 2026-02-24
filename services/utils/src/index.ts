import express from "express";
import env from "./config/evn.js";
import router from "./routers/upload.routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

const {
  PORT,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());

// Middlewares for parsing JSON and encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", router);

app.listen(PORT, () => {
  console.log(`Utils service is running on http://localhost:${PORT}`);
});
