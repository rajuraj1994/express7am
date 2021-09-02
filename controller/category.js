
const Category = require('../model/categoryModel')

exports.Test = (req, res) => {
    res.send('this is a simple url access from the controller')
}

//to insert data in category model
exports.postCategory = async (req, res) => {
    let category = new Category(req.body)
    Category.findOne({ category_name: category.category_name }, async (error, data) => {
        if (data == null) {
            category = await category.save()
            if (!category)
                return res.status(400).json({ error: "Something went wrong" })

            res.json({ category })

        }
        else{
            return res.status(400).json({error:"category must be unique"})
        }

    })

}

//to show all category data
exports.showCategoryList = async (req, res) => {
    const category = await Category.find()
    if (!category) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.json(category)
}

//to show single category
exports.categoryDetails = async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "category not found" })
    }
    res.json({ category })
}
//to update category
exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        { new: true }
    )
    if (!category) {
        return res.status(400).json({ error: "failed to update category" })
    }
    res.send(category)
}

//to delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (!category) {
            return res.status(403).json({ error: "category not found" })
        } else {
            return res.status(200).json({ message: "category deleted" })
        }
    })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}