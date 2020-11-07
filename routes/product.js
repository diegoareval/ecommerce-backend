const express = require("express");
const router = express.Router();

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require("../controllers/user")
const {create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo, listSearch} = require("../controllers/product")

// route - make sure its post
router.post("/products/by/search", listBySearch);
router.post("/products/search", listSearch);
router.delete("/product/:productId/:userId", requireSignin,isAuth, isAdmin, remove)
router.put("/product/:productId/:userId", requireSignin,isAuth, isAdmin, update)
router.get("/product/:productId", read)
router.get("/product/photo/:productId", photo)
router.get("/products", list)
router.get("/products/categories", listCategories)
router.get("/products/related/:productId", listRelated)
router.post("/product/create/:userId",requireSignin,isAuth, isAdmin, create)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router;