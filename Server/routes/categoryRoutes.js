const exp = require("express");
const router = exp.Router();

const {createCategory,getCategories} = require("../controllers/categoryController")

const authMiddleware = require("../middleware/authMiddleware");

router.post("/",authMiddleware,createCategory);

router.get("/",getCategories);

module.exports = router;