const express=require('express')
const router=express.Router()
const{postProduct,productList,productDetails,deleteProduct,updateProduct,listBySearch,listRelated}=require('../controller/product')
const{productValidation}=require('../validation')
const upload=require('../middleware/file-upload')
const{requireSignin}=require('../controller/authController')


router.post('/postproduct',requireSignin,upload.single('product_image'),productValidation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.delete('/deleteproduct/:id',requireSignin,deleteProduct)
router.put('/updateproduct/:id',requireSignin,updateProduct)
router.post('/products/by/search',listBySearch)
router.get('/product/related/:id',listRelated)

module.exports=router
