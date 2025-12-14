import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:npg_SkM7VGUoKi1s@ep-cold-base-admlmgvy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: " api is working success",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
