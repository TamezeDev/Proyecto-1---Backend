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

/* Create new album */
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
    const validSongs = await getSongsIdByName(req.body.tracklist, next);
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
/* Get all albums */
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
      return next(new NotFoundError("There are no albums in the database yet"));
    }

    return res.status(200).json({ albums });
  } catch (error) {
    return next(
      new AppError(`Unexpected error getting albums -> ${error.message}`),
    );
  }
};

/* Get single album by id */
const getAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate("genre")
      .populate({
        path: "tracklist",
        populate: {
          path: "genre",
        },
      });

    if (!album) {
      return next(new NotFoundError("Album not found in database"));
    }

    return res.status(200).json({ album });
  } catch (error) {
    return next(
      new AppError(`Unexpected error getting album -> ${error.message}`),
    );
  }
};

/* Modify a album */
const modifyAlbum = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;

    const album = await Album.findById(req.params.id);

    if (!album) {
      return next(new NotFoundError("Album not found in database"));
    }

    const updatedData = { ...req.body };

    if (updatedData.genre) {
      const genreExists = await Genre.findOne({ name: updatedData.genre });

      if (!genreExists) {
        return next(new ValidationError("Selected genre does not exist"));
      }

      updatedData.genre = genreExists._id;
    }

    if (updatedData.tracklist) {
      if (!Array.isArray(updatedData.tracklist)) {
        return next(
          new ValidationError("Tracklist must be an array of song names"),
        );
      }

      const validSongs = await getSongsIdByName(updatedData.tracklist, next);
      if (validSongs.length === 0)
        return next(
          new ValidationError("Neiter of the songs has been found in database"),
        );
      updatedData.tracklist = validSongs;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("genre")
      .populate({
        path: "tracklist",
        populate: {
          path: "genre",
        },
      });

    return res.status(200).json({
      message: "Album modified successfully",
      updatedAlbum,
    });
  } catch (error) {
    return next(
      new AppError(`Unexpected failure modifying album -> ${error.message}`),
    );
  }
};
/* Delete album by id */
const deleteAlbum = async (req, res, next) => {
  try {
    const deleted = await Album.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new NotFoundError("Album not found in database"));
    }

    return res.status(200).json({
      message: "Album deleted successfully",
      deleted,
    });
  } catch (error) {
    return next(
      new AppError(`Unexpected error deleting album -> ${error.message}`),
    );
  }
};

/* ==============
  PRIVATE METHODS
=================*/
const getSongsIdByName = async (tracklist) => {
  const validSongs = [];
  if (tracklist.length > 0) {
    for (const songName of tracklist) {
      const songFound = await Song.findOne({ title: songName });
      if (!songFound)
        throw new ValidationError(`Song ${songName} not found in database`);
      else validSongs.push(songFound._id);
    }
  } else {
    throw new ValidationError("You must send tracks included in this album");
  }
  return validSongs;
};

export { insertAlbum, getAlbums, getAlbumById, modifyAlbum, deleteAlbum };
