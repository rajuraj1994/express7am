const User = require('../model/authModel')
const Token = require('../model/tokenModel')
const sendEmail = require('../utils/setEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken') //authentication
const expressJwt = require('express-jwt') //authorization

//register user and send confirmation email
exports.userRegister = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    User.findOne({email:user.email},async(error,data)=>{
        if(data==null){
            user = await user.save()
            if (!user) {
                return res.status(400).json({ error: "failed to create an account" })
            }
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.status(400).json({ error: "something went wrong" })
            }
            const url=process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
            sendEmail({
                from: 'no-reply@express-commerce.com',
                to: user.email,
                subject: 'Email Verification Link',
                text: `Hello, \n\n Please verify your account by click in the below link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
                html: `<h1>Confirm your email account</h1>

                      <button><a href="${url}">Verify email</a></button>
                     `
                // http://localhost:8000/api/confirmation/845894794
            })
            res.send(user)

        }
        else{
            return res.status(400).json({error:"email must be unique"})
        }
    })
   
}

//confirming the email
exports.postEmailConfirmation = (req, res) => {
    //at first find the valid or matching token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: "inavalid token or token not found" })
        }
        //if we find the valid token then find the valid user for the token
        User.findOne({ _id: token.userId }, (error, user) => {
            if (error || !user) {
                return res.status(400).json({ error: "we are unable to find the valid user for this token" })
            }
            //check if user is already verified
            if (user.isVerified) {
                return res.status(400).json({ error: "email is already verified please login to continue" })
            }
            //save the verified user
            user.isVerified = true
            user.save((error) => {
                if (error) {
                    return res.status(400).json({ error: error })
                }
                res.json({ message: "congrats,your account has been verified,login to continue" })
            })
        })
    })


}

//signin process 
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    //at first if the email is registered in the database or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: "sorry the email you provided is not found in our system" })
    }
    //if email found then check password to find correct password for that email
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "email or password doesnot match" })
    }
    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "verify your email to continue the process" })
    }
    //now generate token with user id and jwt secret
    const token = jwt.sign({ _id: user._id,user:user.role}, process.env.JWT_SECRET)
    //store token in the cookie
    res.cookie('mycookie', token, { expire: Date.now() + 9999999 })

    //return user information to frontend
    const { _id, name, role } = user
    return res.json({ token, user: { name, email, role, _id } })
}

//signout
exports.signout = (req, res) => {
    res.clearCookie('mycookie')
    res.json({ message: "signout success" })

}

//forget password
exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "sorry the email you provide not found in our system" })
    }
    let token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }
    //send mail
    sendEmail({
        from: 'no-reply@express-commerce.com',
        to: user.email,
        subject: 'Password Reset Link',
        text: `Hello, \n\n Please reset your password by click in the below link:\n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
        html: `<h1>Reset your Password</h1>`
        // http://localhost:8000/api/resetpassword/845894794
    })
    res.json({ message: "password reset link has been sent to your email account" })


}

//reset password
exports.resetPassword=async(req,res)=>{
    //at first find valid token
    let token =await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"inavalid token or token may have expired"})
    }
    //if token found find the valid user for the token
    let user=await User.findOne({
        _id:token.userId,
        email:req.body.email
    })
    if(!user){
        return res.status(400).json({error:"sorry the email you provided not associated with this token,please try valid one"})
    }
    user.password=req.body.password
    user=await user.save()
    if(!user){
        return res.status(400).json({error:"failed to reset password"})
    }
    res.json({message:"password has been reset successfully,login to continue"})
}

//user list
exports.userList=async(req,res)=>{
    const user=await User.find().select('-hashed_password')
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

//single user
exports.userDetails=async(req,res,next)=>{
    const user=await User.findById(req.params.id).select('-hashed_password')
    //select('email role name')
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

//require signin
exports.requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth',
    
})


//resend verification mail
exports.resendVerificationMail=async(req,res)=>{
    //at first find the register user
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"sorry the email is not found in our system please try another or create account"})
    }
    //check if already verified
    if(user.isVerified){
        return res.status(400).json({error:"email is already verified login to continue"})
    }
    //now create token to save in database and send to email verification link
    let token= new Token({
        userId:user._id,
        token:crypto.randomBytes(16).toString('hex')
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"something went wrong"})
    }
    //send mail
    sendEmail({
        from: 'no-reply@express-commerce.com',
        to: user.email,
        subject: 'Email Verification Link',
        text: `Hello, \n\n Please verify your account by click in the below link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
        html: `<h1>Confirm your email account</h1>`
        // http://localhost:8000/api/confirmation/845894794
    })
    res.json({message:"verification link has been sent"})

}


