const Order = require("../models/order");
const Product = require("../models/product")
exports.getDashboardData = async (req,res) => {
 try{

    const totalOrders = await Order.countDocuments();

    const totalProducts = await Product.countDocuments();

        const sales = await Order.aggregate([{
            $group:{
                _id:null,
                totalRevenue:{
                    $sum:"$totalAmount"
                },
            },
        },
    ]);
    res.status(200).json({
        succes:true,
        totalOrders,
        totaOrders: totalOrders,
        totalProducts,
        totalRevenue:sales[0]?.totalRevenue || 0,
    })
    
}catch(error){
    res.status(502).json({
        succes:false,
        message:error.message
    })
}

}