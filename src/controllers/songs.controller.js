import Song from "../models/song.model.js";
import Genre from "../models/genre.model.js";
import {
  InsertError,
  ValidationError,
  AppError,
  NotFoundError,
} from "../../shared/errors/app.error.js";

import { withoutBody } from "../../utils/validations.js";

/* Create a new song */
const insertSong = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;

    if (
      !req.body.title?.trim() ||
      !req.body.artists?.trim() ||
      !req.body.genre ||
      req.body.rating === undefined ||
      !req.body.durationSeconds
    ) {
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );
    }

    const genreExists = await Genre.findOne({ name: req.body.genre });
    if (!genreExists) {
      return next(new ValidationError("Selected genre does not exist"));
    }
    req.body.genre = genreExists._id;
    const newSong = await Song.create(req.body);

    return res.status(201).json(newSong);
  } catch (error) {
    return next(
      new InsertError(`Failed to insert new song -> ${error.message}`),
    );
  }
};

export { insertSong };
