import { Request, Response } from "express";
import { BookingsService } from "./bookings.service";

const bookingsCreate = async (req: Request, res: Response) => {
  try {
    const result = await BookingsService.bookingsCreate(req.user , req.body);
    res.status(200).json({
      success: true,
      message: "bookings Create successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const BookingsController = {
  bookingsCreate,
};
