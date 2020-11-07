const User = require("../models/user")
const  {CartItem, Order} = require("../models/order")
const {errorHandler} = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next , id) =>{
   User.findById(id).exec((err, user) =>{
     if(err || !user){
       res.status(400).json({
         error: 'User not found'
       })
     }
     req.profile = user;
     next();
   })
}

exports.update =(req, res) =>{
   User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (error, user) =>{
         if(error || !user){
       res.status(400).json({
         error: 'You are not authorized'
       })
     }
        user.hashed_password = undefined
       user.salt = undefined
        return res.json(user)
   })
}

exports.read =(req, res) =>{
   req.profile.hashed_password = undefined
   req.profile.salt = undefined
   return res.json(req.profile)
}

exports.addOrdertoUserHistory = (req, res, next) =>{
  let history = []
  req.body.order.products.forEach((item) =>{
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount
    })
  })
  User.findOneAndUpdate({_id: req.profile._id}, {$push: {history: history}}, {new: true}, (error, data)=>{
            if(error || !data){
       res.status(400).json({
         error: 'Could not update the purchase history'
       })
     }
     next()
  })
}

exports.purchaseHistory = (req, res) =>{
  Order.find({user: req.profile._id}).populate("user", "_id name").sort("-created").exec((error, orders) =>{
          if(error){
            res.status(400).json({
                error: errorHandler(error)
              })
          }
          res.json(orders)
  })
}