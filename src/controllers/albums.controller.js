import Album from "../models/album.model.js";
import Genre from "../models/genre.model.js";
import Song from "../models/song.model.js";
import {
  InsertError,
  ValidationError,
  AppError,
  NotFoundError,
} from "../../shared/errors/app.error.js";

import { withoutBody } from "../../utils/validations.js";

/* CREATE ALBUM */
const insertAlbum = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) {
      return;
    }

    if (
      !req.body.title?.trim() ||
      !req.body.rating ||
      !req.body.genre ||
      !Array.isArray(req.body.tracklist)
    ) {
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );
    }
    const validSongs = [];
    if (req.body.tracklist.length > 0) {
      for (const songName of req.body.tracklist) {
        const songFound = await Song.findOne({ title: songName });
        if (!songFound)
          next(new ValidationError(`Song ${songName} not found in database`));
        else validSongs.push(songFound._id);
      }
    } else {
      return next(
        new ValidationError("You must send tracks included in this album"),
      );
    }
    if (validSongs.length === 0)
      return next(
        new ValidationError("Neiter of the songs has been found in database"),
      );
    req.body.tracklist = validSongs;

    const genreExists = await Genre.findOne({ name: req.body.genre });
    if (!genreExists) {
      return next(new ValidationError("Selected genre does not exist"));
    }
    req.body.genre = genreExists._id;

    const newAlbum = await Album.create(req.body);

    await newAlbum.populate([
      { path: "genre" },
      { path: "tracklist", populate: { path: "genre" } },
    ]);

    return res.status(201).json({
      message: "Album created successfully",
      newAlbum,
    });
  } catch (error) {
    return next(
      new InsertError(`Failed to insert new album -> ${error.message}`),
    );
  }
};
/* GET ALL ALBUMS */
const getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find()
      .populate("genre")
      .populate({
        path: "tracklist",
        populate: {
          path: "genre",
        },
      });

    if (albums.length === 0) {
      return next(
        new NotFoundError("There are no albums in the database yet"),
      );
    }

    return res.status(200).json({ albums });
  } catch (error) {
    return next(
      new AppError(
        `Unexpected error getting albums -> ${error.message}`,
      ),
    );
  }
};


export { insertAlbum, getAlbums };
