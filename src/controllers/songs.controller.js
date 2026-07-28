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
/* Gey all songs*/
const getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().populate("genre");

    if (songs.length === 0) {
      return next(new NotFoundError("There are no songs in the database yet"));
    }

    return res.status(200).json({ songs });
  } catch (error) {
    return next(
      new AppError(`Unexpected error getting songs -> ${error.message}`),
    );
  }
};
/* Get single song */
const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id).populate("genre");

    if (!song) {
      return next(new NotFoundError("Song not found in database"));
    }

    return res.status(200).json({ song });
  } catch (error) {
    return next(
      new AppError(`Unexpected error getting song -> ${error.message}`),
    );
  }
};

export { insertSong, getSongs, getSongById };
