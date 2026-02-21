import express from "express";
import env from "./config/evn";

const { PORT } = env;

const app = express();

app.listen(PORT, () => {
  console.log(`Utils service is running on http://localhost:${PORT}`);
});
