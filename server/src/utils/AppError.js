// An error we throw ON PURPOSE, with an HTTP status code and a message that is safe to show users.
//
//   throw new AppError(404, "Trip not found");
//   throw new AppError(400, "Validation failed", [{ field: "email", message: "Invalid email" }]);
//
// The central error handler turns it into a JSON response.
export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
    this.isOperational = true; // marks it as "expected", so its message may be shown to the user
  }
}