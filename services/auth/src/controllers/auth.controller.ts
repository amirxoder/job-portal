import { TryCatch } from "../utils/TryCatch.js";

export const userRegister = TryCatch(async (req, res, next) => {
  const { email } = req.body;
  res.json(email);
});
