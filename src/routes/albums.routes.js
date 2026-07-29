import { Router } from "express";
import {
  insertAlbum,
  getAlbums,
  getAlbumById,
  modifyAlbum,
  deleteAlbum,
} from "../controllers/albums.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertAlbum);
router.put("/:id", isAuth("admin"), modifyAlbum);

router.delete("/:id", isAuth("admin"), deleteAlbum);

router.get("/:id", getAlbumById);
router.get("/", getAlbums);

export default router;
