const mongoose=require('mongoose')
const uuidv1=require('uuidv1')
const crypto=require('crypto')

const authSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:Number,
        default:0
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:String,
    isVerified:{
        type:Boolean,
        default:false
    }


},{timestamps:true})

//virtual fields
authSchema.virtual('password')
.set(function(password){
    this._password=password
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)

})
.get(function(){
    return this._password
})

//defining methods
authSchema.methods={
    authenticate:function(plainText){
        return this.encryptPassword(plainText)=== this.hashed_password

    },
    encryptPassword:function(password){
        if(!password) return ''
        try{
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')

        }
        catch(err){
            return ''
        }

    }
}


module.exports=mongoose.model('Auth',authSchema)