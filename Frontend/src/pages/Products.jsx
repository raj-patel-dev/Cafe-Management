import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const Products = () => {
  const { isAdmin } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for create
  const [formData, setFormData] = useState({
    name: "",
    cetegory: "", // ID of category (note spelling 'cetegory' matching server schema)
    price: 0,
    image: "",
    stock: 0,
    description: "",
    iaAvailable: true, // note spelling 'iaAvailable' matching server schema
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [productsRes, categoriesRes] = await Promise.all([
        API.get("/products"),
        API.get("/categories"),
      ]);

      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (err) {
      console.error("Error loading products/categories:", err);
      setError("Failed to load products. Please make sure the server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      cetegory: categories[0]?._id || "",
      price: 0,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60", // default coffee image
      stock: 10,
      description: "",
      iaAvailable: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      cetegory: product.cetegory?._id || product.cetegory || "",
      price: product.price,
      image: product.image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60",
      stock: product.stock,
      description: product.description || "",
      iaAvailable: product.iaAvailable !== undefined ? product.iaAvailable : true,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? checked 
        : name === "price" || name === "stock" 
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.cetegory) {
      setError("Please select a category first. If none exist, create one under Categories.");
      setSubmitting(false);
      return;
    }

    try {
      if (editingProduct) {
        // Update Product
        await API.put(`/products/${editingProduct._id}`, formData);
        setSuccess("Product updated successfully!");
      } else {
        // Create Product
        await API.post("/products", formData);
        setSuccess("Product added to menu successfully!");
      }
      setModalOpen(false);
      fetchProductsAndCategories();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product. Ensure all details are correct.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product from the menu?")) return;

    setError("");
    setSuccess("");

    try {
      await API.delete(`/products/${id}`);
      setSuccess("Product deleted successfully!");
      fetchProductsAndCategories();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Admin rights required.");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400 text-sm">Loading cafe menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-50 font-serif">Menu Items &amp; Products</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage cafe menu prices, stock availability and descriptions</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-950/20 active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            Add Menu Product
          </button>
        )}
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 bg-[#110f0e] border border-amber-950/15 rounded-2xl shadow-xl">
          No menu products found. {isAdmin ? "Add products using the button above." : "Please check back later."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-[#110f0e] border border-amber-950/15 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/20 transition-all duration-250 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-44 w-full overflow-hidden bg-neutral-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/75 text-amber-400 backdrop-blur-sm rounded-lg border border-amber-900/20">
                    {product.cetegory?.name || "Uncategorized"}
                  </span>
                </div>
                {!product.iaAvailable && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-800/20 text-xs font-bold rounded-lg uppercase tracking-wider">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-neutral-100 text-base line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h4>
                    <span className="font-extrabold text-amber-400 text-base shrink-0">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {product.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-amber-950/10">
                  <span className="text-xs text-neutral-400">
                    Stock: <span className={product.stock <= 5 ? "text-amber-500 font-bold" : "text-amber-100 font-medium"}>
                      {product.stock} left
                    </span>
                  </span>

                  {isAdmin && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-neutral-450 hover:text-amber-400 hover:bg-amber-950/10 rounded-lg transition-colors"
                        title="Edit Menu Item"
                      >
                        <PencilSquareIcon className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 text-neutral-450 hover:text-red-400 hover:bg-red-950/10 rounded-lg transition-colors"
                        title="Delete Menu Item"
                      >
                        <TrashIcon className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#161412] border border-amber-900/30 p-8 rounded-3xl shadow-2xl z-10 animate-fade-in-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-amber-400 p-1"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold font-serif text-amber-50 mb-6">
              {editingProduct ? "Edit Menu Product" : "Add Menu Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Iced Vanilla Latte"
                  className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              {/* Category & Price Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Category
                  </label>
                  <select
                    name="cetegory"
                    value={formData.cetegory}
                    onChange={handleInputChange}
                    className="w-full bg-[#201d1a] text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
              </div>

              {/* Image URL & Stock Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Availability Status
                  </label>
                  <div className="flex items-center h-12 pl-1">
                    <input
                      type="checkbox"
                      id="iaAvailable"
                      name="iaAvailable"
                      checked={formData.iaAvailable}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-amber-500 bg-[#201d1a] border border-amber-900/30 rounded"
                    />
                    <label htmlFor="iaAvailable" className="ml-3 text-sm text-neutral-300">
                      Available to order
                    </label>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Paste direct image link..."
                  className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                  Menu Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your delicious creation..."
                  className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-[#201d1a] border border-amber-900/10 hover:bg-[#25221e] text-neutral-450 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
