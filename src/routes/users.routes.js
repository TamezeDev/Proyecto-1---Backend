import { Router } from "express";
import {
  login,
  createUser,
  deleteSelectedUser,
  deleteOwnself,
} from "../controllers/users.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/create", createUser);
router.delete("/", isAuth("admin"), deleteSelectedUser);
router.delete("/myself", isAuth(), deleteOwnself);

export default router;
