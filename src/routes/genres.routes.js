import { Router } from "express";
import { insertGenre } from "../controllers/genres.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create",isAuth("admin"), insertGenre);

export default router;
