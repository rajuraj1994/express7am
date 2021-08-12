const express=require('express')
const { Test, postCategory,showCategoryList,categoryDetails,updateCategory,deleteCategory } = require('../controller/category')

const{requireSignin}=require('../controller/authController')

const router=express.Router()

router.get('/welcome',Test)
router.post('/postcategory',requireSignin,postCategory)
router.get('/categorylist',showCategoryList)
router.get('/category/:id',categoryDetails)
router.put('/updatecategory/:id',requireSignin,updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)


module.exports=router