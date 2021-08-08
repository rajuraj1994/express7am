const mongoose=require('mongoose')

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
})
.then(()=>console.log('database connected'))