import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CheckCircleIcon,
  ListBulletIcon,
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cart State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Status update state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        API.get("/products"),
        API.get("/categories"),
        API.get("/orders"),
      ]);

      // Only show available products in order panel
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      console.error("Error loading order screen data:", err);
      setError("Failed to load orders or products. Make sure the server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart operations
  const addToCart = (product) => {
    if (!product.iaAvailable || product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setError(`Cannot add more. Only ${product.stock} items left in stock.`);
          setTimeout(() => setError(""), 3000);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty. Add menu items first.");
      return;
    }
    if (!customerName.trim()) {
      setError("Please enter customer name.");
      return;
    }

    setSubmittingOrder(true);
    setError("");
    setSuccess("");

    // Prepare payload
    const orderPayload = {
      customerName: customerName.trim(),
      items: cart.map((item) => ({
        product: item.product._id,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: cartTotal,
      status: orderStatus,
    };

    try {
      await API.post("/orders", orderPayload);
      setSuccess("Order placed successfully!");
      setCart([]);
      setCustomerName("");
      setOrderStatus("pending");
      
      // Update order list and product stock
      fetchData();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setError("");
    setSuccess("");

    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setSuccess(`Order status updated to ${newStatus}`);
      fetchData();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update status. Verify connection.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => (p.cetegory?._id || p.cetegory) === activeCategory);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400 text-sm">Loading ordering desk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-none">
      <div>
        <h2 className="text-2xl font-bold text-amber-50 font-serif">Order Workspace</h2>
        <p className="text-neutral-400 text-sm mt-1">Take client orders and manage queue statuses</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/20 text-red-400 text-sm rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-800/20 text-emerald-400 text-sm rounded-2xl flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Take Order Panel (Col Span 8) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-amber-600 text-neutral-900 shadow-md"
                  : "bg-[#161412] text-neutral-450 hover:bg-[#201d1a]"
              }`}
            >
              All Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat._id
                    ? "bg-amber-600 text-neutral-900 shadow-md"
                    : "bg-[#161412] text-neutral-450 hover:bg-[#201d1a]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Available Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const inStock = prod.stock > 0 && prod.iaAvailable;
              return (
                <button
                  key={prod._id}
                  disabled={!inStock}
                  onClick={() => addToCart(prod)}
                  className={`flex flex-col text-left bg-[#110f0e] border rounded-2xl overflow-hidden p-4 group transition-all duration-200 ${
                    inStock
                      ? "border-amber-950/15 hover:border-amber-500/30 cursor-pointer active:scale-[0.98]"
                      : "border-neutral-900 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="relative w-full h-28 bg-neutral-950 rounded-xl overflow-hidden mb-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <span className="absolute bottom-2 right-2 text-xs font-extrabold bg-[#161412]/95 px-2 py-0.5 rounded-lg border border-amber-950/20 text-amber-400">
                      ${prod.price?.toFixed(2)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-100 text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {prod.name}
                  </h4>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Stock: {prod.stock} items left
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE COLUMN: Cart Desk (Col Span 4) */}
        <div className="xl:col-span-4 bg-[#110f0e] border border-amber-950/15 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-lg text-amber-50 flex items-center gap-2 pb-4 border-b border-amber-950/10">
            <ShoppingCartIcon className="h-5 w-5 text-amber-500" />
            Current Basket
          </h3>

          {cart.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-sm">
              Your basket is empty.<br />Click products on the left menu to add.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Basket list */}
              <div className="divide-y divide-amber-950/5 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-sm text-neutral-100 truncate">{item.product.name}</h5>
                      <span className="text-xs text-neutral-500">
                        ${item.price?.toFixed(2)} x {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1 hover:bg-[#201d1a] border border-amber-950/20 rounded-md text-amber-550 hover:text-amber-400"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-semibold text-neutral-200">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item.product)}
                        className="p-1 hover:bg-[#201d1a] border border-amber-950/20 rounded-md text-amber-550 hover:text-amber-400"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFromCart(item.product._id)}
                        className="p-1 text-neutral-450 hover:text-red-400 hover:bg-red-950/10 rounded-md"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Basket details form */}
              <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-amber-950/10">
                {/* Customer name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rachel Green"
                    className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-2.5 px-3.5 outline-none focus:border-amber-500/50 text-sm"
                    required
                  />
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Initial Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full bg-[#201d1a] text-neutral-100 border border-amber-900/30 rounded-xl py-2.5 px-3.5 outline-none focus:border-amber-500/50 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Total amount */}
                <div className="flex justify-between items-center py-2 text-neutral-350">
                  <span className="font-semibold text-sm">Grand Total</span>
                  <span className="font-extrabold text-amber-400 text-lg">${cartTotal?.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {submittingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Queue Orders History list */}
      <div className="bg-[#110f0e] border border-amber-950/15 rounded-3xl p-6 shadow-xl">
        <h3 className="font-serif font-bold text-lg text-amber-50 mb-6 flex items-center gap-2">
          <ListBulletIcon className="h-5 w-5 text-amber-500" />
          Active Order Queue
        </h3>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No order logs recorded. Make a transaction above to view records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-amber-950/10 text-neutral-400 text-xs font-semibold uppercase tracking-wider bg-[#161412]/50">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Items Ordered</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/5">
                {orders.slice().reverse().map((order) => (
                  <tr key={order._id} className="hover:bg-[#181614]/30 transition-colors">
                    <td className="py-4.5 px-6 font-semibold text-amber-100">
                      {order.customerName}
                    </td>
                    <td className="py-4.5 px-6 text-neutral-500 text-xs">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4.5 px-6 max-w-xs">
                      <div className="text-xs text-neutral-400 space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="truncate">
                            • {item.product?.name || "Deleted Product"} ({item.quantity}x)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4.5 px-6 font-bold text-neutral-200">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4.5 px-6">
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
                    <td className="py-4.5 px-6 text-right">
                      {order.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(order._id, "completed")}
                            disabled={updatingOrderId === order._id}
                            className="px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-500/15 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <CheckIcon className="h-3 w-3" />
                            Done
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, "cancelled")}
                            disabled={updatingOrderId === order._id}
                            className="px-2.5 py-1 text-[10px] font-bold uppercase bg-red-500/15 hover:bg-red-500/35 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <XMarkIcon className="h-3 w-3" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
