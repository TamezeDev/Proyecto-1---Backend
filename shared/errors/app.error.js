class AppError extends Error {
  constructor(message, status = 500) {
    (super(message),
      (this.status = status),
      Error.captureStackTrace(this, this.constructor));
  }
}

class InserError extends AppError {
  constructor(message = "Error insertando datos") {
    super(message, 422);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthError extends AppError {
  constructor(message = "No autorizado") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = " Acceso denegado") {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

export {
  AppError,
  InserError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
};
