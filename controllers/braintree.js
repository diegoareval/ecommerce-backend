
const User = require("../models/user")
require("dotenv").config()
const braintree = require("braintree")

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


exports.generateToken = (req, res) =>{
gateway.clientToken.generate({}, function(error, response){
if(error){
  res.status(500).send(error)
}else{
  res.send(response)
}
})

}

exports.processPayment = (req, res) =>{
  let payloadFromTheClient = req.body.paymentMethodNonce
  let clientAmount = req.body.amount

  // make transaction
  let newTransaction = gateway.transaction.sale({
    amount: clientAmount,
    paymentMethodNonce: payloadFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (error, result) =>{
     if(error){
       res.status(500).send(error)
     }else{
       res.json(result)
     }
  })
}