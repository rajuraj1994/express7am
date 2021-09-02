const Product = require('../model/productModel')

//to store product  in database
exports.postProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInStock: req.body.countInStock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        product_rating: req.body.product_rating,
        category: req.body.category
    })
    product=await product.save()
    if(!product){
        return res.status(400).json({error:"failed to insert product"})
    }
    res.send(product)
}

//to show all products
exports.productList=async(req,res)=>{
    let order=req.query.order ? req.query.order:'asc'
    let sortBy=req.query.order ? req.query.sortBy:'_id'
    let limit=req.query.order ? parseInt(req.query.limit):200

    const product=await Product.find()
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    
    if(!product){
        return res.status(400).json({error:'failed to fetch products'})

    }
    res.send(product)
}
//to show single product
exports.productDetails=async(req,res)=>{
    const product=await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({error:"product not found"})
    }
    res.send(product)
   
}


//to delete product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (!product) {
            return res.status(403).json({ error: "product not found" })
        } else {
            return res.status(200).json({ message: "product deleted" })
        }
    })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

//to update product
exports.updateProduct=async(req,res)=>{
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            countInStock: req.body.countInStock,
            product_description: req.body.product_description,
            product_image: req.file.path,
            product_rating: req.body.product_rating,
            category: req.body.category
        },
        {new:true}
    )
    if(!product){
        return res.status(400).json({error:"failed to update product"})
    }
    res.send(product)
}

// to filter product by category and price range
exports.listBySearch=async(req,res)=>{
    let order=req.body.order ? req.body.order:'desc'
    let sortBy=req.body.sortBy ? req.body.sortBy:'_id'
    let limit=req.body.limit ? parseInt(req.body.limit):200
    let skip=parseInt(req.body.skip)
    let findArgs={}

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=="product_price"){
                //gte- greater than price[0-1000]
                //lte -less than
                findArgs[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }else{
                findArgs[key]=req.body.filters[key]
            }
        }
    }
    const product=await Product.find(findArgs)
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .skip(skip)
    
    if(!product){
        return res.status(400).json({error:'Something went wrong'})

    }
    res.json({
        size:product.length,
        product
    })

}

//LIST RELATED TO SAME CATEGORY
exports.listRelated=async(req,res)=>{
    let single_product= await Product.findById(req.params.id)
    let limit=req.query.limit ? parseInt(req.query.limit):6
    let product= await Product.find({_id:{$ne:single_product},category:single_product.category})
    .limit(limit)
    .populate('category','category_name')

    if(!product){
        return res.status(400).json({error:'Something went wrong'})

    }
    res.send(product)
        
}