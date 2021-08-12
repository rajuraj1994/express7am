exports.productValidation=(req,res,next)=>{
    req.check('product_name',"Product Name is Required").notEmpty()
    req.check('product_price',"Price is Required").notEmpty()
    .isNumeric()
    .withMessage('Price contains only numeric value')
    req.check('countInStock',"stock number is required").notEmpty()
    .isNumeric()
    .withMessage('Stock contains only numeric value')
    req.check('product_description',"Description is required").notEmpty()
    .isLength({
        min:30
    })
    .withMessage('Description must be more than 30 characters')
    req.check('category','Category is required').notEmpty()

    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(error=>error.msg)[0]
        return res.status(400).json({error:showError})
    }
    next();

}


exports.userValidation=(req,res,next)=>{
    req.check('name',"Name is Required").notEmpty()
    req.check('email',"email is Required").notEmpty()
    .isEmail()
    .withMessage('invalid email')
    req.check('password',"password is required").notEmpty()
    .isLength({
        min:8
    })
    .withMessage('password must be more than 8 characters')


    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(error=>error.msg)[0]
        return res.status(400).json({error:showError})
    }
    next();

}