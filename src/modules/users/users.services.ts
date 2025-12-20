import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );
  return result;
};

const updateUsers = async (payload: Record<string, unknown>) => {
  const { id, name, email, phone, role } = payload;

  const result = await pool.query(
    `
    UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role
    `,
    [name, email, phone, role, id]
  );

  return result;
};

const deleteUser = async (userId: number) => {
  const activeBooking : number | any = await pool.query(
    `
    SELECT 1
    FROM bookings
    WHERE customer_id = $1
      AND status = 'active'
    `,
    [userId]
  );

  if (activeBooking.rowCount > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id
    `,
    [userId]
  );

  return result;
};

export const usersServices = {
  getUsers,
  updateUsers,
  deleteUser,
};
