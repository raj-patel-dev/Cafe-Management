const Category = require("../models/category");

exports.createCategory = async (req,res) => {
 try{
    const category = await Category.create(req.body);
    res.status(200).json({
        succes:true,
        category,
    })
 }catch(error){
    res.status(502).json({
        succes:false,
        message:error.message,
 })
}
}

exports.getCategories = async (req,res) => {
    try{
    const categories = await Category.find();
    res.status(200).json({
        succes:true,
        categories
    })
    }
    catch(error){
        res.status(501).json({
            succes:false,
            message:error.message
        })
    }
}