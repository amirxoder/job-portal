import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";

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
    const [user] = await sql`
      INSERT INTO users (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashedPassword}, ${phoneNumber}, ${role}) RETURNING user_id, name, email, phone_number, role, created_at
    `;

    registeredUser = user;
  }

  res.json(registeredUser);
});
