import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Inventory = () => {
  const { isAdmin } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for create, item object for edit
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 0,
    unit: "pcs",
    minimumStock: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/inventory");
      // inventory API returns: { success: true, inventory: [...] }
      setInventory(res.data.inventory || []);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setError("Failed to load inventory list. Please make sure the server is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      itemName: "",
      quantity: 0,
      unit: "pcs",
      minimumStock: 5,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit || "pcs",
      minimumStock: item.minimumStock || 5,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "minimumStock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingItem) {
        // Update Inventory Item
        const res = await API.put(`/inventory/${editingItem._id}`, formData);
        setSuccess("Inventory item updated successfully!");
      } else {
        // Create Inventory Item
        const res = await API.post("/inventory", formData);
        setSuccess("Inventory item added successfully!");
      }
      setModalOpen(false);
      fetchInventory();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error saving inventory item:", err);
      setError(err.response?.data?.message || "Failed to save inventory item. Verify all values.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    setError("");
    setSuccess("");

    try {
      await API.delete(`/inventory/${id}`);
      setSuccess("Inventory item deleted successfully!");
      fetchInventory();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      setError("Failed to delete inventory item. Admin rights required.");
    }
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400 text-sm">Loading inventory list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-50 font-serif">Inventory &amp; Ingredients</h2>
          <p className="text-neutral-400 text-sm mt-1">Track stocks and receive automated alerts for low supplies</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-950/20 active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            Add Item
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

      {/* Low Stock Overview Alert bar */}
      {inventory.some((item) => item.quantity <= item.minimumStock) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm rounded-2xl flex items-center gap-3.5 animate-pulse">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
          <div>
            <span className="font-bold">Attention Needed:</span> Some ingredients have fallen below their safety threshold! Refill stock to prevent menu availability issues.
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="bg-[#110f0e] border border-amber-950/15 rounded-2xl shadow-xl overflow-hidden">
        {inventory.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-sm">
            No inventory items found. {isAdmin ? "Add items using the button above." : "Please check back later."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-amber-950/10 text-neutral-400 text-xs font-semibold uppercase tracking-wider bg-[#161412]/50">
                  <th className="py-4 px-6">Ingredient Name</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Current Stock</th>
                  <th className="py-4 px-6">Min Threshold</th>
                  {isAdmin && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/5">
                {inventory.map((item) => {
                  const isLow = item.quantity <= item.minimumStock;
                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-[#181614]/30 transition-colors ${
                        isLow ? "bg-amber-950/5" : ""
                      }`}
                    >
                      <td className="py-4.5 px-6 font-semibold text-amber-100">
                        {item.itemName}
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 font-semibold">
                        <span className={isLow ? "text-amber-400 font-bold" : "text-neutral-200"}>
                          {item.quantity} {item.unit || "pcs"}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-neutral-500">
                        {item.minimumStock || 5} {item.unit || "pcs"}
                      </td>
                      {isAdmin && (
                        <td className="py-4.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-amber-950/10 rounded-lg transition-all duration-200"
                              title="Edit stock"
                            >
                              <PencilSquareIcon className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-neutral-450 hover:text-red-400 hover:bg-red-950/15 rounded-lg transition-all duration-200"
                              title="Delete item"
                            >
                              <TrashIcon className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-[#161412] border border-amber-900/30 p-8 rounded-3xl shadow-2xl z-10 animate-fade-in-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-amber-400 p-1"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-bold font-serif text-amber-50 mb-6">
              {editingItem ? "Edit Stock Item" : "Add Inventory Item"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="e.g. Milk, Coffee Beans, Paper Cups"
                  className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              {/* Quantity and Unit Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="pcs, kg, liters"
                    className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                    required
                  />
                </div>
              </div>

              {/* Minimum Stock Alert Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
                  Min Stock Threshold (Alert level)
                </label>
                <input
                  type="number"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-[#201d1a]/50 text-neutral-100 border border-amber-900/30 rounded-xl py-3 px-4 outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-[#201d1a] border border-amber-900/10 hover:bg-[#25221e] text-neutral-400 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
