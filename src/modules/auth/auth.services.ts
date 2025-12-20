import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hasPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role, created_at, updated_at`,
    [name, email, hasPassword, phone, role]
  );

  return result;
};

const signinUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const secret = config.JWT_SECRET as string;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "1d" }
  );

  return { token, user };
};

export const authServices = {
  signupUser,
  signinUser,
};
