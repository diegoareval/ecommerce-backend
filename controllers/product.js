
const formidable = require("formidable");
const _ = require("lodash")
const fs = require("fs")
const Product = require("../models/product");
const {errorHandler} = require("../helpers/dbErrorHandler");
const { parseInt } = require("lodash");

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

exports.update = (req, res) =>{
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
            let product = req.product
            product = _.extend(product, fields)
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

exports.remove = (req, res) => {
   let product = req.product
   product.remove((error, deletedProduct) =>{
     if(error){
       res.status(400).json({
         error: errorHandler(error)
       })
     }
     res.json({
       deletedProduct,
       message: "Product was removed"
     })
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

// sold = http://localhost:8000/api/products?sortBy=sold&order=desc&limit=4
// arival = http://localhost:8000/api/products?sortBy=createdAt&order=desc&limit=4
exports.list = (req, res) =>{
  let order = req.query.order ? req.query.order: 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
  let limit = req.query.limit ? parseInt(req.query.limit): 6
  Product.find().select("-photo").populate('category').sort([[sortBy, order]]).limit(limit).exec((err, products) =>{
    if(err){
            res.status(400).json({
                error: 'Products not found'
              })
          }
          res.json(products)
  })
}

exports.listRelated = (req, res) =>{
  let limit = req.query.limit ? parseInt(req.query.limit): 6
  Product.find({_id: {$ne: req.product}, category: req.product.category}).limit(limit).populate('category', '_id name').exec((err, products) =>{
     if(err){
            res.status(400).json({
                error: 'Products not found'
              })
          }
          res.json(products)
  })
}