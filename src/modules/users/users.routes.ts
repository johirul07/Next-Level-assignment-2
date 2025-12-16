import { Router } from "express";
import { usersControllers } from "./users.controllers";

const router = Router();

router.get("/", usersControllers.getUsers);

export const usersRoutes = router;
