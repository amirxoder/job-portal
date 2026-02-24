import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT!,
  DB_URI: process.env.DB_URI!,
  UPLOAD_SERVICE_URL: process.env.UPLOAD_SERVICE_URL!,
};
