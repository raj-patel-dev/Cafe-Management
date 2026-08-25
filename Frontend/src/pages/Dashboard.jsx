import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import {
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Orders (accessible by both roles)
        const ordersRes = await API.get("/orders");
        const orders = ordersRes.data.orders || [];
        setRecentOrders(orders.slice(-5).reverse());

        // 2. Fetch Inventory (accessible by both roles) to check low stock items
        const inventoryRes = await API.get("/inventory");
        const inventory = inventoryRes.data.inventory || [];
        const lowStockCount = inventory.filter(
          (item) => item.quantity <= item.minimumStock
        ).length;

        if (isAdmin) {
          // Admin: fetch dashboard summary API
          const dashboardRes = await API.get("/dashboard");
          setStats({
            revenue: dashboardRes.data.totalRevenue || 0,
            orders: dashboardRes.data.totalOrders || orders.length,
            products: dashboardRes.data.totalProducts || 0,
            lowStock: lowStockCount,
          });
        } else {
          // Staff: compute stats from orders list directly to avoid 403
          const completedOrders = orders.filter((o) => o.status === "completed");
          const revenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          setStats({
            revenue,
            orders: orders.length,
            products: 0, // Staff doesn't need this count or we can query it
            lowStock: lowStockCount,
          });

          // Fetch products count for staff if they have access
          try {
            const productsRes = await API.get("/products");
            const productsCount = productsRes.data.products?.length || 0;
            setStats((prev) => ({ ...prev, products: productsCount }));
          } catch (e) {
            console.log("Could not fetch products count for staff dashboard", e);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Could not load dashboard statistics. Please make sure the server is connected.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400 text-sm">Preparing cafe dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-800/20 via-orange-950/10 to-transparent border border-amber-900/10 p-8 rounded-3xl">
        <div className="absolute right-10 bottom-0 top-0 flex items-center justify-center opacity-10 pointer-events-none text-9xl">
          ☕
        </div>
        <div className="max-w-xl">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Bean &amp; Brew Cafe</span>
          <h2 className="text-3xl font-bold font-serif text-amber-50 mt-1">Hello, {user?.name || "Team Member"}!</h2>
          <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
            {isAdmin 
              ? "Here is your business performance snapshot. You have full controls to edit menus, check stocks, and manage employees."
              : "Welcome to your cafe workspace. Use the orders tab to process sales, check categories, and view product stock."
            }
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              to="/orders"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-950/30 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 stroke-[2.5]" />
              New Order
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/20 text-red-400 text-sm rounded-2xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-[#110f0e] border border-amber-950/15 p-6 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-200 hover:border-amber-500/20">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Total Revenue</span>
            <h3 className="text-2xl font-bold text-amber-50 mt-1">
              ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="text-[10px] text-emerald-400 mt-1 block">▲ Live sales</span>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <CurrencyDollarIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-[#110f0e] border border-amber-950/15 p-6 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-200 hover:border-amber-500/20">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Total Orders</span>
            <h3 className="text-2xl font-bold text-amber-50 mt-1">
              {stats.orders}
            </h3>
            <span className="text-[10px] text-amber-500/60 mt-1 block">Processed orders</span>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-[#110f0e] border border-amber-950/15 p-6 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-200 hover:border-amber-500/20">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Active Menu Items</span>
            <h3 className="text-2xl font-bold text-amber-50 mt-1">
              {stats.products}
            </h3>
            <span className="text-[10px] text-amber-500/60 mt-1 block">In category menu</span>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <ShoppingBagIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-[#110f0e] border border-amber-950/15 p-6 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-200 hover:border-amber-500/20">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Low Stock Alerts</span>
            <h3 className={`text-2xl font-bold mt-1 ${stats.lowStock > 0 ? "text-amber-500" : "text-amber-50"}`}>
              {stats.lowStock}
            </h3>
            <span className="text-[10px] text-amber-500/60 mt-1 block">Needs attention</span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            stats.lowStock > 0 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}>
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-[#110f0e] border border-amber-950/15 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-lg text-amber-50">Recent Transactions</h3>
            <Link to="/orders" className="text-xs text-amber-500 hover:underline">
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              No orders placed yet. Click "New Order" to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead>
                  <tr className="border-b border-amber-950/10 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3.5 pl-2">Customer</th>
                    <th className="pb-3.5">Date</th>
                    <th className="pb-3.5">Amount</th>
                    <th className="pb-3.5 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-950/5">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#181614]/30 transition-colors">
                      <td className="py-4 pl-2 font-medium text-amber-100">{order.customerName}</td>
                      <td className="py-4 text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-semibold text-amber-50">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-4 pr-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : order.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Operations Guide / Low Stock list */}
        <div className="bg-[#110f0e] border border-amber-950/15 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-lg text-amber-50">Cafe Guide &amp; Rules</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3.5 p-3.5 bg-[#171513]/60 rounded-xl border border-amber-900/10">
              <span className="text-xl">💡</span>
              <div>
                <h5 className="font-semibold text-sm text-neutral-200">Processing Orders</h5>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Go to Orders page to create new orders. Ensure customer name and quantity are correct before submission.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 bg-[#171513]/60 rounded-xl border border-amber-900/10">
              <span className="text-xl">🔧</span>
              <div>
                <h5 className="font-semibold text-sm text-neutral-200">Stock Thresholds</h5>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Low stock alert flashes if quantity drops below minimum threshold. Ensure items are refilled as needed.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 p-3.5 bg-[#171513]/60 rounded-xl border border-amber-900/10">
              <span className="text-xl">👩‍🍳</span>
              <div>
                <h5 className="font-semibold text-sm text-neutral-200">Admin Control</h5>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Only Administrators have full edit/delete privileges for inventory, categories and products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
