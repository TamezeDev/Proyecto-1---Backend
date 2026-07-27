import { Router } from "express";
import {
  login,
  createUser,
  deleteSelectedUser,
  deleteOwnself,
  getUsers,
  modifyUser,
} from "../controllers/users.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";
import upload from "../../shared/middlewares/files.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/create", createUser);

router.delete("/", isAuth("admin"), deleteSelectedUser);
router.delete("/myself", isAuth(), deleteOwnself);

router.get("/", isAuth("admin"), getUsers);
router.put("/", isAuth(), upload.single("image"), modifyUser);

export default router;
