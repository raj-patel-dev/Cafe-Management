const exp = require("express");
const router = exp.Router();

const {register,login} = require("../controllers/authController");

router.post("/register",register)
router.post("/login",login)

module.exports = router;