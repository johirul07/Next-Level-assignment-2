import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTION_STRING,
  PORT: process.env.PORT,
  JWT_SECRET : process.env.JWT_SECRET
};


export default config;