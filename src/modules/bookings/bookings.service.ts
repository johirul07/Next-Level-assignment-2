import { pool } from "../../config/db";

const bookingsCreate = async (user: any, payload: Record<string, unknown>) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("Missing required fields");
  }

  if (
    new Date(rent_end_date as string) <=
    new Date(rent_start_date as string)
  ) {
    throw new Error("Invalid date range");
  }

  const vehicleRes = await pool.query(
    "SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const total_price = days * vehicle.daily_rent_price;

  const bookingInsertRes = await pool.query(
    `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING id
    `,
    [user.id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [vehicle_id]
  );

  const bookingId = bookingInsertRes.rows[0].id;

  const bookingRes = await pool.query(
    `
    SELECT
      bookings.id,
      bookings.customer_id,
      bookings.vehicle_id,
      bookings.rent_start_date,
      bookings.rent_end_date,
      bookings.total_price,
      bookings.status,
      json_build_object(
        'vehicle_name', vehicles.vehicle_name,
        'daily_rent_price', vehicles.daily_rent_price
      ) AS vehicle
    FROM bookings
    JOIN vehicles ON vehicles.id = bookings.vehicle_id
    WHERE bookings.id = $1
    `,
    [bookingId]
  );

  return bookingRes.rows[0];
};

export const BookingsService = {
  bookingsCreate,
};
