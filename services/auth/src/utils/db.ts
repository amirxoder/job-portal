import { neon } from "@neondatabase/serverless";
import { env } from "../config/env.js";

const { DB_URI } = env;

export const sql = neon(DB_URI as string);
