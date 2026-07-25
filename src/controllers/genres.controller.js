import Genre from "../models/genre.model.js";
import { InsertError, ValidationError } from "../../shared/errors/app.error.js";

/* Add new genres to db */
const insertGenre = async (req, res, next) => {
  try {
    const isGenre = await Genre.findOne({ name: req.body.name });

    if (isGenre)
      return next(
        new ValidationError("This genre has been sent is already in the db"),
      );

    const newGenre = await Genre.create(req.body);
    res.status(200).json(newGenre);
  } catch (error) {
    next(new InsertError(`Error: Failed insert new genre -> ${error}`));
  }
};

export { insertGenre };
