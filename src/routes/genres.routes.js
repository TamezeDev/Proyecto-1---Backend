import { Router } from "express";
import {
  insertGenre,
  deleteGenre,
  getGenres,
  modifyGenre,
} from "../controllers/genres.controller.js";
import { isAuth } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.get("/", isAuth("admin"), getGenres);
router.post("/create", isAuth("admin"), insertGenre);
router.put("/:id", isAuth("admin"), modifyGenre);
router.delete("/:id", isAuth("admin"), deleteGenre);

export default router;
