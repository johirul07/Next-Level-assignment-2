import { Router } from "express";
import { usersControllers } from "./users.controllers";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin"), usersControllers.getUsers);

router.put("/:userId", auth("admin", "customer"), usersControllers.updateUsers);

router.delete("/:userId", auth("admin"), usersControllers.deleteUser);

export const usersRoutes = router;
