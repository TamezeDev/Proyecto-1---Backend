import { Router } from "express";
import { insertGenre, deleteGenre } from "../controllers/genres.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertGenre);
router.delete("/:id", isAuth("admin"), deleteGenre);

export default router;
