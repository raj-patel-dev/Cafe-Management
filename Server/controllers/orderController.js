const Order = require("../models/order")

exports.createOrder = async (req,res) => {
    try{const order = await Order.create(req.body);
    res.status(200).json({
        succes:true,
        order
    })
}catch(error){
    res.status(502).json({
        succes:false,
        message:error.message
    })
}
}
exports.getOrders = async (req,res) => {
    try{
        const orders = await Order.find().populate("items.product");    
        res.status(200).json({
            succes:true,
            orders
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
}
exports.updateOrderStatus = async (req,res) =>{
    try{
        const order = await Order.findByIdAndUpdate(
        req.params.id,
        {status:req.body.status},
        {new:true}
    );
    res.status(200).json({
    succes:true,
    order
    })
}catch(error){
    res.status(502).json({
        succes:false,
           message:error.message
    })
}
}