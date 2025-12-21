import { pool } from "../../config/db";

const bookingsCreate = async (user: any, payload: any) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("Missing required fields");
  }

  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("Invalid date range");
  }

  const vehicleRes = await pool.query(
    "SELECT id, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

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
      bookings.status
    FROM bookings
    WHERE bookings.id = $1
    `,
    [bookingId]
  );

  return bookingRes.rows[0];
};

const bookingList = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT
        bookings.id,
        bookings.customer_id,
        bookings.vehicle_id,
        bookings.rent_start_date,
        bookings.rent_end_date,
        bookings.total_price,
        bookings.status,
        json_build_object(
          'name', users.name,
          'email', users.email
        ) AS customer,
        json_build_object(
          'vehicle_name', vehicles.vehicle_name,
          'daily_rent_price', vehicles.daily_rent_price
        ) AS vehicle
      FROM bookings
      JOIN users ON users.id = bookings.customer_id
      JOIN vehicles ON vehicles.id = bookings.vehicle_id
      ORDER BY bookings.id DESC
    `);

    return result.rows;
  }

  const result = await pool.query(
    `
    SELECT
      bookings.id,
      bookings.vehicle_id,
      bookings.rent_start_date,
      bookings.rent_end_date,
      bookings.total_price,
      bookings.status,
      json_build_object(
        'vehicle_name', vehicles.vehicle_name,
        'registration_number', vehicles.registration_number,
        'type', vehicles.type
      ) AS vehicle
    FROM bookings
    JOIN vehicles ON vehicles.id = bookings.vehicle_id
    WHERE bookings.customer_id = $1
    ORDER BY bookings.id DESC
    `,
    [user.id]
  );

  return result.rows;
};

interface UpdateBookingPayload {
  bookingId: string;
  user: {
    id: number;
    role: string;
  };
  status: "cancelled" | "returned";
}

const updateBooking = async (payload: UpdateBookingPayload) => {
  const { bookingId, user, status } = payload;
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (bookingRes.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (booking.status === "cancelled") {
    throw new Error("Cancelled booking cannot be updated");
  }

  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("Unauthorized to update this booking");
    }

    if (status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const now = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (now >= startDate) {
      throw new Error("Cannot cancel booking after rental period has started");
    }
  }


  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }
  }

  const updateRes = await pool.query(
    ` UPDATE bookings SET status = $1 WHERE id = $2 RETURNING * `,
    [status, bookingId]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [booking.vehicle_id]
  );

  return updateRes.rows[0];
};

export const BookingsService = {
  bookingsCreate,
  bookingList,
  updateBooking,
};
