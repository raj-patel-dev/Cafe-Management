const exp = require("express");
const router = exp.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getDashboardData } = require("../controllers/dashboardController");
const adminMiddelware = require("../middleware/adminMiddleware");

router.get("/",authMiddleware,adminMiddelware,getDashboardData);

module.exports = router;