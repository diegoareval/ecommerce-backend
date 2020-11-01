const express = require("express");
const router = express.Router();

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require("../controllers/user")
const {create, productById, read, remove} = require("../controllers/product")

router.delete("/product/:productId/:userId", requireSignin,isAuth, isAdmin, remove)
router.get("/product/:productId", read)
router.post("/product/create/:userId",requireSignin,isAuth, isAdmin, create)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router;