import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.updateUsers({
      ...req.body,
      id: req.params.userId,
    });

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        message: "User updated successfully",
        success: true,
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.deleteUser({
      userId: req.params.userId,
    });

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: " User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const usersControllers = {
  getUsers,
  updateUsers,
  deleteUser,
};
