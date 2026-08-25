const exp = require("express");
const router = exp.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");

router.post("/",authMiddleware,createOrder);

router.get("/",authMiddleware,getOrders);

router.put("/:id/status",authMiddleware,updateOrderStatus);

module.exports = router;