import { Router } from "express";
import { login, createUser } from "../controllers/users.controller.js";

const router = Router();

router.post("/login", login);
router.post("/create", createUser);

export default router;
