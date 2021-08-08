const express=require('express')
const router=express.Router()
const {postOrder,orderList,orderDetails,updateStatus,deleteOrder,userOrders}=require('../controller/ordercontroller')

router.post('/postorder',postOrder)
router.get('/orderlist',orderList)
router.get('/orderdetails/:id',orderDetails)
router.put('/updatestatus/:id',updateStatus)
router.delete('/deleteorder/:id',deleteOrder)
router.get('/userorderlist/:userid',userOrders)

module.exports=router