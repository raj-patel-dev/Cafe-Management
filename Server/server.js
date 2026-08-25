const exp = require("express");
const cors = require("cors");

require ("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const orderRoutes = require("./routes/orderRoutes");

const productRoutes = require("./routes/productRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes")

const app = exp();

connectDB();

app.use(cors());
app.use(exp.json());

app.use("/api/auth",authRoutes);

app.use("/api/categories",categoryRoutes);

app.use("/api/products",productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard",dashboardRoutes);

app.use("/api/inventory",inventoryRoutes);

app.get("/",(req,res)=>{
    res.send("Cafe Management API is running");
});
const PORT = process.env.PORT|| 3000;

app.listen(PORT, () => {
    console.log(`server is running on port: http://localhost:${PORT}`);
})

