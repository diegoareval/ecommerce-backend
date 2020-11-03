
const Category = require("../models/category");
const {errorHandler} = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) =>{
   Category.findById(id).exec((error, category) =>{
     if(error || !category){
        res.status(400).json({
       error: 'Category does not exist'
     })
     }
     req.category = category
     next()
   })
}

exports.remove = (req, res) =>{
 const category = req.category
 category.remove((error, data) =>{
   if(error || !data){
     res.status(400).json({
       error: errorHandler(err)
     })
   }
   res.json({
     message: "Category Deleted"
   })
 })
}

exports.list = (req, res) =>{
 Category.find().exec((error, data)=>{
   if(error || !data){
     res.status(400).json({
       error: errorHandler(err)
     })
   }
   res.json(data)
 })
}

exports.update = (req, res) =>{
 const category = req.category
 category.name = req.body.name
 category.save((error, data) =>{
   if(error || !data){
     res.status(400).json({
       error: errorHandler(err)
     })
   }
   res.json(data)
 })
}

exports.read = (req, res) =>{
  return res.json(req.category)
}

exports.create = (req, res) =>{
const category = new Category(req.body)
category.save((err, data) =>{
   if(err || !data) {
     res.status(400).json({
       error: errorHandler(err)
     })
   }
   res.json({
     data
   })
})
}