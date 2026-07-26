import { verifyToken } from "../../utils/token.js";
import User from "../../src/models/user.model.js";
import {
  AuthError,
  ValidationError,
  ForbiddenError,
} from "../errors/app.error.js";

const isAuth = (...allowedRoles) => {
  return async (req, _res, next) => {
    try {
      const jwt = req.headers.authorization?.split(" ")[1];
      if (!jwt) return next(new ValidationError("Error: JWT is required"));

      const userId = verifyToken(jwt).id;
      req.userId = userId;
      const userDb = await User.findById(userId);

      if (!userDb) return next(new ForbiddenError());
      if (allowedRoles.length > 0 && !allowedRoles.includes(userDb.role))
        return next(new AuthError());
      next();
    } catch (error) {
      next(new AuthError(error));
    }
  };
};

export default isAuth;
