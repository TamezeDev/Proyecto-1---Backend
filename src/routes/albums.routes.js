import { Router } from "express";
import { insertAlbum, getAlbums } from "../controllers/albums.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";
import { get } from "mongoose";

const router = Router();

router.post("/create", isAuth("admin"), insertAlbum);
router.get("/", getAlbums);

export default router;
