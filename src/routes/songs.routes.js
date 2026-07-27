import { Router } from "express";
import { insertSong } from "../controllers/songs.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertSong);

export default router;
