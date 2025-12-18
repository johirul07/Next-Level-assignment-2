import { Request, Response } from "express";
import { usersServices } from "./users.services";
import { JwtPayload } from "jsonwebtoken";

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
    const loggedInUser = req.user;
    const targetUserId = req.params.userId;

    if (
      !loggedInUser ||
      (loggedInUser.role !== "admin" && loggedInUser.userId !== targetUserId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }

    if (loggedInUser.role !== "admin" && req.body.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot change your role",
      });
    }

    const result = await usersServices.updateUsers({
      ...req.body,
      id: targetUserId,
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
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
