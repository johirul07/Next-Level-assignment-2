import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const vehiclesCreate = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.vehiclesCreate(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const allVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.allVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles  retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const vehiclesDetails = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.vehiclesDetails({
      vehicleId: req.params.vehicleId,
    });
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicles not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles data fetched",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.updateVehicles({
      ...req.body,
      vehicleId: req.params.vehicleId,
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicles(
      req.params.vehicleId!
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const vehiclesControllers = {
  vehiclesCreate,
  allVehicles,
  vehiclesDetails,
  updateVehicles,
  deleteVehicles,
};
