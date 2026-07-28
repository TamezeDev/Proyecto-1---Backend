import { Router } from "express";
import {
  insertSong,
  getSongs,
  getSongById,
  modifySong,
  deleteSong,
} from "../controllers/songs.controller.js";
import isAuth from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isAuth("admin"), insertSong);
router.get("/", getSongs);
router.get("/:id", getSongById);
router.put("/:id", isAuth("admin"), modifySong);
router.delete("/:id", isAuth("admin"), deleteSong);

export default router;
