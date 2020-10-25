
const jwt = require('jsonwebtoken') // generated token auth
const expressJwt = require('express-jwt') // for authorization check
const User = require('../models/user')
const {errorHandler} = require("../helpers/dbErrorHandler")

exports.signup = (req, res) => {
  console.log("req.body " +req.body)
  const user = new User(req.body)

  user.save((err, user)=>{
      if(err){
        return res.status(400).json({
          err: errorHandler(err)
        });
      }
      user.salt = undefined
      user.hashed_password = undefined
      res.json({
        user
      })
  })
}

exports.signin = (req, res) =>{
  // find user by email
  const {email, password} = req.body
  User.findOne({email}, (err, user) =>{
    if(err || !user){
      return res.status(400).json({
        error: 'User does not exits'
      })
    }
    // if user exists we need the passwords match

    // create authenticate method user model
    if(!user.authenticate(password)){
      return res.status(401).json({
        error: 'Email and password dont mach'
      })
    }
    // generate a sign token user id and secret word
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

    // persist token on cookies with persist date
    res.cookie('t', token, {expire: new Date() + 9999})

    // return data to frontend
    const {_id, name, email, role} = user
    return res.json({token, user: {_id, name, email, role}})
  })

}

exports.signout = (req, res) =>{
res.clearCookie('t');
res.json({message: "SignOut succesfully"})
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
})

exports.isAuth = (req, res, next) =>{
  let user = req.profile && req.user && req.profile._id == req.user._id
if(!user){
   return res.status(403).json({
        error: 'Access Denied'
      })
}
  next()
}

exports.isAdmin = (req, res, next) =>{
  if(req.profile.role===0){
    return res.status(403).json({
        error: 'Admin Resource. Access Denied'
      })
  }
  next()
}