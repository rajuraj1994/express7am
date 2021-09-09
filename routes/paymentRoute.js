const express=require('express')
const { processPayment,sendStripeApi } = require('../controller/paymentController')

const{requireSignin}=require('../controller/authController')

const router=express.Router()

router.post('/payment/process',requireSignin,processPayment)
router.get('/stripeapi',sendStripeApi)


module.exports=router