import express from "express";

import authRoutes from "./routes/auth.route.js";

const app = express();

// Middleware to parse JSON bodies and encode URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

export default app;
