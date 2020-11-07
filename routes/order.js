const express = require("express");
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {userById, addOrdertoUserHistory, purchaseHistory} = require("../controllers/user")
const {create, listOrders, getStatusValues, updateOrderStatus, orderById} = require("../controllers/order")

const {decreaseQuantity} = require("../controllers/product")
router.post("/order/create/:userId", requireSignin, isAuth, addOrdertoUserHistory, decreaseQuantity, create)
router.get("/order/status-values/:userId", requireSignin, isAuth, isAdmin, getStatusValues)
router.put("/order/:orderId/status/:userId", requireSignin, isAuth, isAdmin, updateOrderStatus)
router.post("/order/by/user/:userId", requireSignin, isAuth, purchaseHistory)
router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders)
router.param('userId', userById)
router.param('orderId', orderById)
module.exports = router