import { Router } from "express";
import { insertAlbum } from "../controllers/albums.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertAlbum);

export default router;
