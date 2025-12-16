import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getUsers();

    res.status(200).json({
      success: true,
      message: "User get successfully",
      data: result.rows,
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
};
