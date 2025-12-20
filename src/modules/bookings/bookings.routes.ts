import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), BookingsController.bookingsCreate);

router.get("/", auth("admin", "customer"), BookingsController.bookingList);

router.put("/:bookingId", auth("admin", "customer"), BookingsController.updateBooking);

export const bookingsRoutes = router;
