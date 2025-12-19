import { Router } from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehiclesControllers.vehiclesCreate);

router.get("/", vehiclesControllers.allVehicles);

router.get("/:vehicleId", vehiclesControllers.vehiclesDetails);

router.put("/:vehicleId", auth("admin"), vehiclesControllers.updateVehicles);

router.delete("/:vehicleId", auth("admin"), vehiclesControllers.deleteVehicles);

export const vehiclesRoutes = router;
