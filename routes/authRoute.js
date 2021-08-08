const express=require('express')
const router=express.Router()
const{userRegister, postEmailConfirmation,signIn,signout,forgetPassword,resetPassword,userList,userDetails,requireSignin,resendVerificationMail}=require('../controller/authController')

router.post('/register',userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/signout',signout)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignin,userList)
router.get('/userdetails/:id',requireSignin,userDetails)
router.post('/resendverification',resendVerificationMail)

module.exports=router
