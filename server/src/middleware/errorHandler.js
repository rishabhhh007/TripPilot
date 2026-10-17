import { AppError } from "../utils/AppError.js";

// Runs when no route matched the request.
export function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// The ONE place where errors become responses. Every route sends errors here (via next(err)).
// Response shape is always: { message, details? }
export function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";
  let status = err.status || 500;
  let message = err.message || "Server error";
  let details = err.details;

  // Translate common library errors into clean 4xx responses.
  if (err.name === "ValidationError" && err.errors) {
    // Mongoose schema validation
    status = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === "CastError") {
    // e.g. an invalid MongoDB id in the URL
    status = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key (e.g. an email that is already registered)
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    message = field ? `That ${field} is already in use` : "That value is already in use";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Request body is not valid JSON";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large";
  }

  // Unexpected problems (bugs, crashes): log everything, but never leak internals to users in production.
  const isExpected = err.isOperational || status < 500;
  if (!isExpected) {
    console.error(err);
    if (isProduction) message = "Something went wrong on the server.";
  }

  res.status(status).json({
    message,
    ...(details && { details }),
    ...(!isProduction && !isExpected && { stack: err.stack }),
  });
}