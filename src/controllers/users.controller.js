import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  AppError,
  ValidationError,
  ForbiddenError,
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

export { login, createUser };
