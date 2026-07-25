import { Router } from "express";
import { insertGenre } from "../controllers/genres.controller.js";

const router = Router();

router.post("/create", insertGenre);

export default router;
