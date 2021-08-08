const mongoose=require('mongoose')
const{ObjectId}=mongoose.Schema

const orderItemsSchema=new mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:ObjectId,
        ref:'Product',
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('OrderItem',orderItemsSchema)