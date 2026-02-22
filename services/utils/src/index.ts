import express from "express";
import env from "./config/evn.js";
import router from "./routes.js";
import cors from "cors";

const { PORT } = env;

const app = express();

app.use(cors());

// Middlewares for parsing JSON and encoded data
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", router);

app.listen(PORT, () => {
  console.log(`Utils service is running on http://localhost:${PORT}`);
});
