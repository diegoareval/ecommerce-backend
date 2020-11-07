const  {CartItem, Order} = require("../models/order")
const {errorHandler} = require("../helpers/dbErrorHandler");
const order = require("../models/order");

exports.create = (req, res) =>{
   req.body.order.user = req.profile
   const order = new Order(req.body.order)
   order.save((error, data) =>{
     if(error || !data){
     res.status(400).json({
       error: errorHandler(error)
     })
   }
   res.json(data)
   })
}

exports.listOrders = (req, res) =>{
  Order.find().populate('user', "_id name address").sort('-created').exec((error, orders) =>{
    if(error || !orders){
     res.status(400).json({
       error: errorHandler(error)
     })
   }
   res.json(orders)
  })
}

exports.orderById = (req, res, next, id) =>{
  Order.findById(id).populate('products.product', 'name price').exec((error, order) =>{
     if (error) {
                return res.status(400).json({
                     error: errorHandler(error)
                });
            }
req.order = order
next()

  })
}

exports.getStatusValues = (req, res) =>{
    res.json(Order.schema.path("status").enumValues);
}

exports.updateOrderStatus = (req, res) =>{
Order.update({_id: req.body.order.orderId}, {$set: req.body.status}, (error, order) =>{
  if (error) {
                return res.status(400).json({
                     error: errorHandler(error)
                });
            }
            res.json(order)
})
}