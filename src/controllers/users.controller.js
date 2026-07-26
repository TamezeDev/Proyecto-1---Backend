import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  AppError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/app.error.js";
import { withoutBody } from "../../utils/validations.js";
import { generateToken } from "../../utils/token.js";

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
    next(AppError(`Inexpected failure creating user -> ${error}`));
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
    res
      .status(200)
      .json({ message: "User deleted succesfully", user: userdeleted });
  } catch (error) {
    next(AppError(`Inexpected failure deleting user -> ${error}`));
  }
};
/* Delete user delected account */
const deleteOwnself = async (req, res, next) => {
  try {
    const userdeleted = await User.findOneAndDelete({ _id: req.userId });
    if (!userdeleted)
      return next(new NotFoundError("User doesn't found in database"));
    res
      .status(200)
      .json({ message: "User deleted succesfully", user: userdeleted });
  } catch (error) {
    next(AppError(`Inexpected failure deleting user -> ${error}`));
  }
};
export { login, createUser, deleteSelectedUser, deleteOwnself };
