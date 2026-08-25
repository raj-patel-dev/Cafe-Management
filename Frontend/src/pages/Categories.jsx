import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import { FolderIcon, PlusIcon, FolderOpenIcon } from "@heroicons/react/24/outline";

const Categories = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/categories");
      // Categories API returns: { success: true, categories: [...] }
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories list. Make sure the server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/categories", { name: newCategoryName });
      setSuccess("Category created successfully!");
      setNewCategoryName("");
      // Refresh list
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.response?.data?.message || "Failed to create category. Ensure it doesn't already exist.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400 text-sm">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-50 font-serif">Category Management</h2>
        <p className="text-neutral-400 text-sm mt-1">Organize your cafe menu items into clean categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Category Panel */}
        <div className="bg-[#110f0e] border border-amber-950/15 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-serif font-bold text-lg text-amber-50 flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-amber-500" />
            Add New Category
          </h3>

          {error && (
            <div className="p-3.5 bg-red-950/30 border border-red-800/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 text-xs rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Hot Coffees, Cold Brews, Pastries"
                className="w-full bg-[#201d1a]/50 text-neutral-100 placeholder-neutral-500 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {actionLoading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-[#110f0e] border border-amber-950/15 rounded-2xl p-6 shadow-xl">
          <h3 className="font-serif font-bold text-lg text-amber-50 mb-6 flex items-center gap-2">
            <FolderOpenIcon className="h-5 w-5 text-amber-500" />
            Existing Categories
          </h3>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              No categories found. Create your first category on the left side panel.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center gap-4 bg-[#171513]/60 border border-amber-950/10 p-4 rounded-xl hover:border-amber-500/20 transition-all duration-250 group"
                >
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <FolderIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-100 text-sm group-hover:text-amber-300 transition-colors">
                      {category.name}
                    </h4>
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      ID: {category._id?.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
