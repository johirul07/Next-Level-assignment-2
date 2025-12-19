import { pool } from "../../config/db";

const vehiclesCreate = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = pool.query(
    "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING  *",
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const allVehicles = async (payload: Record<string, unknown>) => {
  const result = await pool.query("SELECT * FROM vehicles");
  return result;
};

const vehiclesDetails = async (payload: Record<string, unknown>) => {
  const { vehicleId } = payload;
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);

  return result;
};

const updateVehicles = async (payload: Record<string, unknown>) => {
  const {
    vehicleId,
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name =$1 , type = $2 , registration_number = $3 , daily_rent_price=$4 , availability_status = $5 WHERE id = $6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result;
};

const deleteVehicles = async (payload: Record<string, unknown>) => {
  const { vehicleId } = payload;

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);

  return result;
};

export const vehiclesServices = {
  vehiclesCreate,
  allVehicles,
  vehiclesDetails,
  updateVehicles,
  deleteVehicles,
};
