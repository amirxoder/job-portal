import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

export const userRegister = TryCatch(async (req, res, next) => {
  const { name, email, password, phoneNumber, role, bio } = req.body;

  if (!name || !email || !password || !phoneNumber || !role) {
    throw new ErrorHandler(400, "All fields are required");
  }

  const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (existingUsers.length > 0) {
    throw new ErrorHandler(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let registeredUser;

  if (role === "recruiter") {
    const [user] = await sql`
      INSERT INTO users (name, email, password, phone_number, role, bio) VALUES (${name}, ${email}, ${hashedPassword}, ${phoneNumber}, ${role}, ${bio}) RETURNING user_id, name, email, phone_number, role, created_at
    `;

    registeredUser = user;
  } else if (role === "jobseeker") {
    const file = req.file;

    if (!file) {
      throw new ErrorHandler(400, "Resume file is required for jobseekers");
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      throw new ErrorHandler(
        400,
        "Invalid resume file, Failed to process the resume file",
      );
    }

    const { data } = await axios.post(
      `${env.UPLOAD_SERVICE_URL}/api/utils/upload`,
      {
        buffer: fileBuffer.content,
      },
    );

    const [user] = await sql`
      INSERT INTO users (name, email, password, phone_number, role, bio,resume, resume_public_id) VALUES (${name}, ${email}, ${hashedPassword}, ${phoneNumber}, ${role}, ${bio}, ${data.url}, ${data.public_id}) RETURNING user_id, name, email, phone_number, role, bio, resume, created_at
    `;

    registeredUser = user;
  }

  const token = jwt.sign(
    { id: registeredUser?.user_id },
    env.JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  return res.status(201).json({
    message: "User registered successfully",
    registeredUser,
  });
});
