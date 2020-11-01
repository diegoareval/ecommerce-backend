
const formidable = require("formidable");
const _ = require("lodash")
const fs = require("fs")
const Product = require("../models/product");
const {errorHandler} = require("../helpers/dbErrorHandler")

exports.productById = (req, res, next, id) =>{
Product.findById(id).exec((error, product) =>{
 if(error || !product){
   res.status(400).json({
         error: 'Product not found'
       })
 }
 req.product = product
 next()
})
}

exports.read = (req, res) =>{
  req.product.photo = undefined
  return  res.json(req.product)
}

exports.create = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) =>{
            if(err){
              res.status(400).json({
                error: "Image could not uploaded"
              })
            }
            
          const {name, description, price, category, quantity, shipping} = fields
        if(!name || !description || !price  || !category || !quantity || !shipping){
              res.status(400).json({
              error: "all the fields are required"
            })
        }
            let product = new Product(fields)
       if(files.photo){
        
         if(files.photo.size>10000000) {
           res.status(400).json({
                error: "Image is too big"
              })
         }
         product.photo.data = fs.readFileSync(files.photo.path)
         product.photo.contentType = files.photo.type
       }
       product.save((error, result) =>{
          if(error){
            res.status(400).json({
                error: errorHandler(error)
              })
          }
           res.json(result)
       })
    })
}