import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User create successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signinUser(req.body);

    res.status(200).json({
      success: true,
      message: "User Login successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authControllers = {
  signupUser,
  signinUser,
};
