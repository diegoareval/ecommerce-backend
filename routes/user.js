const express = require("express");
const router = express.Router();
const {userSignupValidator, validationsTerms} = require('../validator')
const {signup} = require('../controllers/user.js');
router.post("/signup", 
validationsTerms,
 userSignupValidator
,signup)

module.exports = router;