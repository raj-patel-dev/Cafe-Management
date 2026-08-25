const exp = require("express");
const router = exp.Router();

const { createInventory, getInventory, getInventoryById, updateInventory, deleteInventory } = require("../controllers/inventoryCotroller")

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddelware = require("../middleware/adminMiddleware");

router.post("/",authMiddleware,adminMiddelware,createInventory);

router.get("/",authMiddleware,getInventory);

router.get("/:id",authMiddleware,getInventoryById);

router.put("/:id",authMiddleware,adminMiddelware,updateInventory);

router.delete("/:id",authMiddleware,adminMiddelware,deleteInventory);

module.exports = router;