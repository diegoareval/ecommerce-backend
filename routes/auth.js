const express = require("express");
const router = express.Router();
const {userSignupValidator, validationsTerms} = require('../validator')
const {signup, signin, signout, requireSignin} = require('../controllers/auth.js');
router.post("/signup", 
validationsTerms,
 userSignupValidator
,signup)

router.post("/signin"
,signin)

router.delete("/signout"
,signout)



module.exports = router;