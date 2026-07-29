import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  AppError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/app.error.js";
import { getSongsIdByName } from "../controllers/songs.controller.js";
import { getAlbumsIdByName } from "../controllers/albums.controller.js";
import { withoutBody } from "../../utils/validations.js";
import { generateToken } from "../../utils/token.js";
import { deleteImgCloudinary } from "../../utils/cloudinary.util.js";

/* Check user credential returning jwt with userId */
const login = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;

    if (!req.body.email || !req.body.password)
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );

    const userDb = await User.findOne({ email: req.body.email });
    if (!userDb) return next(new ForbiddenError("Wrong credential"));

    const matchPass = await bcrypt.compare(req.body.password, userDb.password);
    if (!matchPass) return next(new ForbiddenError("Wrong credential"));
    const jwt = generateToken(userDb._id);
    res.status(200).json({ sessionToken: jwt });
  } catch (error) {
    next(new AppError(`Inexpected failure while login -> ${error}`));
  }
};
/* Create a new user account */
const createUser = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;
    if (
      !req.body.name ||
      !req.body.lastname ||
      !req.body.email ||
      !req.body.password ||
      !req.body.bornYear
    )
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );

    const used = await User.findOne({ email: req.body.email });
    if (used)
      return next(new ValidationError("Email selected is already registered"));

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(new AppError(`Inexpected failure creating user -> ${error}`));
  }
};
/* Delete user delected account */
const deleteSelectedUser = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;
    if (!req.body.email)
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );
    const userdeleted = await User.findOneAndDelete({ email: req.body.email });
    if (!userdeleted)
      return next(new NotFoundError("Email sent doesn't found in database"));
    res;
    if (userdeleted.imgId) deleteImgCloudinary(userdeleted.imgId);
    res
      .status(200)
      .json({ message: "User deleted succesfully", user: userdeleted });
  } catch (error) {
    next(new AppError(`Inexpected failure deleting user -> ${error}`));
  }
};
/* Delete user delected account */
const deleteOwnself = async (req, res, next) => {
  try {
    const userdeleted = await User.findOneAndDelete({ _id: req.userId });
    if (!userdeleted)
      return next(new NotFoundError("User doesn't found in database"));

    if (userdeleted.imgId) deleteImgCloudinary(userdeleted.imgId);
    res
      .status(200)
      .json({ message: "User deleted succesfully", user: userdeleted });
  } catch (error) {
    next(new AppError(`Inexpected failure deleting user -> ${error}`));
  }
};
/* Get all complete list users */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate({
        path: "favouriteAlbums",
        populate: [
          {
            path: "genre",
            model: "Genre",
          },
          {
            path: "tracklist",
            model: "Song",
            populate: {
              path: "genre",
              model: "Genre",
            },
          },
        ],
      })
      .populate({
        path: "favouriteSongs",
        populate: [
          {
            path: "genre",
            model: "Genre",
          },
        ],
      });
    if (users.length === 0)
      return next(new NotFoundError("La lista de usuarios está vacía"));
    res.status(200).json(users);
  } catch (error) {
    next(new AppError(`Inexpected failure showing user list -> ${error}`));
  }
};
/* MODIFY USER DATA (SUCH AS ADD A NEW PROFILE PHOTO) */
const modifyUser = async (req, res, next) => {
  try {
    const hasBody = req.body && Object.keys(req.body).length > 0;

    if (!hasBody && !req.file) {
      return next(new ValidationError("You must send data or an image"));
    }

    const oldUser = await User.findOne({ _id: req.userId });
    if (!oldUser)
      return next(new NotFoundError("User doesn't found in database"));

    const updatedData = { ...req.body };

    if (req.body.password) {
      const encodedPass = await bcrypt.hash(req.body.password, 10);
      updatedData.password = encodedPass;
    }

    if (req.body.email && oldUser.email !== req.body.email) {
      const usedEmail = await User.findOne({ email: req.body.email });
      if (usedEmail) return next(new ValidationError("Email is already used"));
    }

    const oldImgId = oldUser.imgId;
    if (req.file) {
      updatedData.imgUrl = req.file.path;
      updatedData.imgId = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedUser)
      return next(new NotFoundError("User doesn't found in database"));

    if (req.file && oldImgId) deleteImgCloudinary(oldImgId);

    res.status(200).json({ message: "User modified succesfully", updatedUser });
  } catch (error) {
    next(new AppError(`Inexpected failure modifying user -> ${error}`));
  }
};

const addSongsToFavourite = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;

    const user = await User.findById(req.userId);
    if (!user) return next(new NotFoundError("User doesn't found in database"));

    if (!req.body.favouriteSongs)
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );

    const newSongs = await getSongsIdByName(req.body.favouriteSongs);
    if (newSongs.length === 0)
      return next(
        new ValidationError("Neiter of the songs has been found in database"),
      );

    const reviewedSongs = splitDuplicateSongOrAlbum(
      user.favouriteSongs,
      newSongs,
    );

    if (reviewedSongs.toAdd.length === 0) {
      return next(
        new ValidationError("You haven't any song to add to your song list"),
      );
    }

    const newFavouriteSongList = [
      ...user.favouriteSongs,
      ...reviewedSongs.toAdd,
    ];
    const updated = await User.findByIdAndUpdate(
      user._id,
      { favouriteSongs: newFavouriteSongList },
      { returnDocument: "after", runValidators: true },
    );

    return res.status(200).json({
      message: "Favourite songs updated successfully",
      updated,
      addedSongs: reviewedSongs.toAdd.length,
      alreadyFavourite: reviewedSongs.duplicateList,
    });
  } catch (error) {
    next(
      new AppError(
        `Inexpected failure adding songs to user favourite list -> ${error}`,
      ),
    );
  }
};

const addAlbumsToFavourite = async (req, res, next) => {
  try {
    if (withoutBody(req.body, next)) return;

    const user = await User.findById(req.userId);
    if (!user) return next(new NotFoundError("User doesn't found in database"));

    if (!req.body.favouriteAlbums)
      return next(
        new ValidationError("The body sent hasn't been created successfully"),
      );

    const newAlbums = await getAlbumsIdByName(req.body.favouriteAlbums);
    if (newAlbums.length === 0)
      return next(
        new ValidationError("Neiter of the albums has been found in database"),
      );

    const reviewedAlbums = splitDuplicateSongOrAlbum(
      user.favouriteAlbums,
      newAlbums,
    );

    if (reviewedAlbums.toAdd.length === 0) {
      return next(
        new ValidationError("You haven't any Album to add to your song list"),
      );
    }

    const newFavouriteAlbumList = [
      ...user.favouriteAlbums,
      ...reviewedAlbums.toAdd,
    ];
    const updated = await User.findByIdAndUpdate(
      user._id,
      { favouriteAlbums: newFavouriteAlbumList },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      message: "Favourite Albums updated successfully",
      updated,
      addedAlbums: reviewedAlbums.toAdd.length,
      alreadyFavourite: reviewedAlbums.duplicateList,
    });
  } catch (error) {
    next(
      new AppError(
        `Inexpected failure adding albums to user favourite list -> ${error}`,
      ),
    );
  }
};
const changeRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new NotFoundError("User doesn't found in database"));

    const modified = await User.findByIdAndUpdate(
      user._id,
      { role: req.role },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      message: "Role modified succesfully",
      currentRole: modified.role,
    });
  } catch (error) {
    next(new AppError(`Inexpected failure modifying user role -> ${error}`));
  }
};
/* ==============
  PRIVATE METHODS
=================*/
const splitDuplicateSongOrAlbum = (currentList, listToAdd) => {
  const toAdd = [];
  const duplicateList = [];

  for (const item of listToAdd) {
    const repeated = currentList.some((songId) => songId.equals(item._id));
    if (repeated) duplicateList.push(item.title);
    else toAdd.push(item._id);
  }

  return {
    toAdd,
    duplicateList,
  };
};

export {
  login,
  createUser,
  deleteSelectedUser,
  deleteOwnself,
  getUsers,
  modifyUser,
  addSongsToFavourite,
  addAlbumsToFavourite,
  changeRole,
};
