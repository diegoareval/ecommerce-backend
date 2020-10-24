
// ...rest of the initial code omitted for simplicity.
const { validationResult, check } = require('express-validator');
exports.userSignupValidator = (req, res, next) =>{
  const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();

    if (hasError) {
      res.status(422).json({ error: error.array() });
    } else {
      next();
    }
}

exports.validationsTerms = [
  check('name', "name is required").notEmpty(),
    check("name")
      .isLength({ min: 3 })
      .withMessage("the name must have minimum length of 3")
      .trim(),

    check("email")
      .isEmail()
      .withMessage("invalid email address")
      .normalizeEmail(),

    check("password")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password should have min and max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should have at least one sepcial character"),
  ]

/*
  req.check('name', "name is required").notEmpty()
  req.check('email', 'email must be between 3 and to 32 characteres').
  matches(/.+\@.+\..+/).withMessage("email must contain @").isLength({
    min: 4,
    max: 32
  })
req.check('password', 'password is required').notEmpty()
req.check('password').isLength({
  min: 6
}).withMessage('password must have min size 6 characteres').matches(/\d/)
.withMessage('password must contain at least one number')

const errors = req.validationErrors()
if(errors){
  const firstError = errors.map(error => error.msg)[0];
  return res.status(400).json({error: firstError});
}
*/