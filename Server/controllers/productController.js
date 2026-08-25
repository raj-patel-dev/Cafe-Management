const Product = require("../models/product");

exports.createProduct = async (req,res) => {
    try{
        const product = await Product.create(req.body);
        res.status(200).json({
            succes:true,
            product
        })
    }
    catch(error){
        res.status(502).json({
            succes:false,
            message:error.meassge
        })
    }
}
exports.getProducts = async (req,res) => {
    try{
        const products = await Product.find().populate("cetegory");
        res.status(200).json({
            succes:true,
            products
        }) 
    }
    catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
};
exports.getPeoductById = async (req,res) => {
    try{
        const product = await Product.findById(
            req.params.id
        ).populate("cetegory");
        if(!product){
            return res.status(404).json({
                succes:false,
                message:"Product not found"
            });
        }
        res.status(200).json({
            succes:true,
            product
        });
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
};
exports.updateProduct = async (req,res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            succes:true,
            product
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
}
exports.deleteProduct = async (req,res) => {
    try{
        const product = await Product.findByIdAndDelete(
            req.params.id
        )
        res.status(200).json({
            succes:true,
            product
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message,
        })
    }
}