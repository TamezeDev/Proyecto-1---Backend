import Genre from "../models/genre.model.js";
import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import {
  InsertError,
  ValidationError,
  AppError,
  NotFoundError,
} from "../../shared/errors/app.error.js";
import { withoutBody } from "../../utils/validations.js";

/* Add new genres to db */
const insertGenre = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;
    if (!req.body.name)
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );

    const isGenre = await Genre.findOne({ name: req.body.name });

    if (isGenre)
      return next(
        new ValidationError("This genre has been sent is already in the db"),
      );

    const newGenre = await Genre.create(req.body);
    res.status(201).json(newGenre);
  } catch (error) {
    next(new InsertError(`Error: Failed insert new genre -> ${error}`));
  }
};
/* Delete genre */
const deleteGenre = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return next(
        new NotFoundError("This genre hasn't been found in the database"),
      );

    const [songCounts, albumCounts] = await Promise.all([
      Song.countDocuments({ genre: genre._id }),
      Album.countDocuments({ genre: genre._id }),
    ]);

    if (songCounts > 0 || albumCounts > 0)
      return next(
        new ValidationError(
          "Denied opertion: This genre is been used on several songs or albums.",
        ),
      );

    const deleted = await Genre.findByIdAndDelete(genre._id);
    res.status(200).json({ deleted });
  } catch (error) {
    next(new AppError(`Inexpected error deleting genre -> ${error}`));
  }
};

export { insertGenre, deleteGenre };
