const express=require('express')
const router=express.Router()
const{postProduct,productList,productDetails,deleteProduct,updateProduct}=require('../controller/product')
const{productValidation}=require('../validation')
const upload=require('../middleware/file-upload')


router.post('/postproduct',upload.single('product_image'),productValidation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.delete('/deleteproduct/:id',deleteProduct)
router.put('/updateproduct/:id',updateProduct)
module.exports=router
