const { validationResult } = require("express-validator");

// Turns express-validator results into a consistent 400 response.
// `message` is the first error (handy for toasts); `errors` has the full list.
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({
    success: false,
    message: errors[0].message,
    errors,
  });
};
