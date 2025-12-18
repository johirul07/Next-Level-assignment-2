import { Router } from "express";
import { usersControllers } from "./users.controllers";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth(), usersControllers.getUsers);

router.put("/:userId",auth(), usersControllers.updateUsers);

router.delete("/:userId",auth(), usersControllers.deleteUser);

export const usersRoutes = router;
