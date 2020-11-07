const User = require("../models/user")

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