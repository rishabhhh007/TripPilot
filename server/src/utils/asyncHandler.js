// Express 4 does not catch errors from async route functions by itself.
// Wrap an async controller with this, and any error (or rejected promise) is sent to the error handler.
//
//   router.get("/", asyncHandler(async (req, res) => { ... }));
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};