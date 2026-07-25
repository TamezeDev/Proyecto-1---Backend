import { ValidationError } from "../shared/errors/app.error.js";

const withoutBody = (body, next) => {
  if (!body || Object.keys(body).length === 0) {
    next(new ValidationError("You must to send the body with the query"));
    return true;
  }
  return false;
};

export { withoutBody };
