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
/* Get all genres */
const getGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    if (genres.length === 0)
      return next(
        new NotFoundError("There isn't any genre in the database yet"),
      );

    res.status(200).json({ genres });
  } catch (error) {
    next(new AppError(`Inexpected error deleting genre -> ${error}`));
  }
};
/* Modify some genre */
const modifyGenre = async (req, res, next) => {
  try {
    const hasBody = req.body && Object.keys(req.body).length > 0;

    if (!hasBody && !req.file) {
      return next(new ValidationError("You must send data to change it"));
    }

    const genre = await Genre.findOne({ _id: req.params.id });
    if (!genre)
      return next(
        new NotFoundError("This genre hasn't been found in the database"),
      );

    const updatedData = { ...req.body };

    const updatedGenre = await Genre.findByIdAndUpdate(genre._id, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedGenre)
      return next(
        new NotFoundError("This genre hasn't been found in the database"),
      );

    res
      .status(200)
      .json({ message: "Genre modified succesfully", updatedGenre });
  } catch (error) {
    next(new AppError(`Inexpected failure modifying user -> ${error}`));
  }
};

export { insertGenre, deleteGenre, getGenres, modifyGenre };
