const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)

//process stripe payment => /api/payment/process

exports.processPayment=async(req,res,next)=>{
    const paymentIntent =await stripe.paymentIntent.create({
        amount:req.body.amount,
        currency:'nrs',

        metadata:{integration_check:'accept_a_payment'}
    })
    res.status(200).json({
        success:true,
        client_Secret:paymentIntent.client_Secret
    })

}


//send stripe API key => /api/stripeapi

exports.sendStripeApi=async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })

}