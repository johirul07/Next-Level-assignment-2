import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes);

app.use("/api/v1/bookings", bookingsRoutes);

export default app;
