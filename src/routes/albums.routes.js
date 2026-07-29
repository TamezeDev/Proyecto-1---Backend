import { Router } from "express";
import {
  insertAlbum,
  getAlbums,
  getAlbumById,
} from "../controllers/albums.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertAlbum);

router.get("/:id", getAlbumById);
router.get("/", getAlbums);

export default router;
