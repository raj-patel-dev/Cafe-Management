const exp = require("express");
const router = exp.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createProduct, getProducts, getPeoductById, updateProduct, deleteProduct 
} = require("../controllers/productController");
const adminMiddelware = require("../middleware/adminMiddleware");

router.post("/",authMiddleware,adminMiddelware,createProduct);

router.get("/",getProducts);

router.get("/:id",getPeoductById);

router.put("/:id",authMiddleware,adminMiddelware,updateProduct);

router.delete("/:id",authMiddleware,adminMiddelware,deleteProduct);

module.exports = router;


