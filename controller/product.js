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
    const product=await Product.find()
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