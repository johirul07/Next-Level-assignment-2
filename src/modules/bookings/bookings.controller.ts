import { Request, Response } from "express";
import { BookingsService } from "./bookings.service";

const bookingsCreate = async (req: Request, res: Response) => {
  try {
    const result = await BookingsService.bookingsCreate(req.user, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const bookingList = async (req: Request, res: Response) => {
  try {
    const result = await BookingsService.bookingList(req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message:
        req.user.role === "admin" ? "All bookings list" : "User bookings list",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await BookingsService.updateBooking({
      bookingId: bookingId as string,
      user: {
        id: req.user.id,
        role: req.user.role,
      },
      status ,
    });

    res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const BookingsController = {
  bookingsCreate,
  bookingList,
  updateBooking,
};
