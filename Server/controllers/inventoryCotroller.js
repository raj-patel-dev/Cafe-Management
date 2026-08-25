const Inventory =  require("../models/inventory")

exports.createInventory = async(req,res) => {
    try{
        const inventory = await Inventory.create(req.body);
        res.status(200).json({
            succes:true,
            inventory,
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
}
exports.getInventory = async (req,res) => {
    try{
        const inventory = await Inventory.find();
        res.status(200).json({
            succes:true,
            inventory
        })
    }catch(error){
        res.status(502).json({
        succes:false,
        message:error.message
    })
    }
}
exports.getInventoryById = async (req,res) => {
    try{
        const inventory = await Inventory.findById(req.params.id);
        if(!inventory){
            return res.status(404).json({
                succes:false,
                message:"Item not found"
            })
        }
        res.status(200).json({
            succes:true,
            inventory
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
}
exports.updateInventory = async (req,res) => {
  try{
    const inventory = await Inventory.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json({
        succes:true,
        inventory
    })
  }catch(error){
    res.status(502).json({
        succes:false,
        message:error.message
    })
  }
}
exports.deleteInventory = async (req,res) => {
    try{
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        res.status(200).json({
            succes:true,
            message:"Item Deleted"
        })
    }catch(error){
        res.status(502).json({
            succes:false,
            message:error.message
        })
    }
} 