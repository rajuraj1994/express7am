const express=require('express')
const { Test, postCategory,showCategoryList,categoryDetails,updateCategory,deleteCategory } = require('../controller/category')


const router=express.Router()

router.get('/welcome',Test)
router.post('/postcategory',postCategory)
router.get('/categorylist',showCategoryList)
router.get('/category/:id',categoryDetails)
router.put('/updatecategory/:id',updateCategory)
router.delete('/deletecategory/:id',deleteCategory)


module.exports=router