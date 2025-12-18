import { Router } from "express";
import { usersControllers } from "./users.controllers";

const router = Router();

router.get("/", usersControllers.getUsers);

router.put("/:userId", usersControllers.updateUsers);

router.delete("/:userId", usersControllers.deleteUser);

export const usersRoutes = router;
