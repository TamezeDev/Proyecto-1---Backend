import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  AppError,
  ValidationError,
  ForbiddenError,
} from "../../shared/errors/app.error.js";
import { withoutBody } from "../../utils/validations.js";
import { generateToken } from "../../utils/token.js";

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

export { login };
