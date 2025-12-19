import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), BookingsController.bookingsCreate);

export const bookingsRoutes = router;
