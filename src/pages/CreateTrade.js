"use client";

import { useState, useEffect } from "react";
import { tradeAPI } from "../services/api";

const CreateTrade = () => {
  const [formData, setFormData] = useState({
    userId: "",
    script: "",
    quantity: "",
    buyingRange: "",
    avgPrice: "",
    stopLoss: "",
    supportLevels: "",
    resistanceLevels: "",
    takeProfitTargets: "",
    exitPlan: "",
    trailingPlan: "",
        description: "", // 🆕 Added
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        userId: parsedUser?.user?._id || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tradeData = {
        ...formData,
        quantity: Number.parseInt(formData.quantity),
        avgPrice: Number.parseFloat(formData.avgPrice),
        stopLoss: Number.parseFloat(formData.stopLoss),
        supportLevels: formData.supportLevels
          ? formData.supportLevels.split(",").map((level) => Number.parseFloat(level.trim()))
          : [],
        resistanceLevels: formData.resistanceLevels
          ? formData.resistanceLevels.split(",").map((level) => Number.parseFloat(level.trim()))
          : [],
        takeProfitTargets: formData.takeProfitTargets
          ? formData.takeProfitTargets.split(",").map((target) => Number.parseFloat(target.trim()))
          : [],
      };

      await tradeAPI.createTrade(tradeData);
      setSuccess("✅ Trade created successfully!");

      // Reset form but keep userId
      setFormData({
        userId: formData.userId,
        script: "",
        quantity: "",
        buyingRange: "",
        avgPrice: "",
        stopLoss: "",
        supportLevels: "",
        resistanceLevels: "",
        takeProfitTargets: "",
        exitPlan: "",
        trailingPlan: "",
        description: "",
      });
    } catch (err) {
      setError("❌ Failed to create trade. Please check all fields.");
      console.error("Create trade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Trade</h1>

      {error && <div className="text-red-500 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden userId (auto from localStorage) */}
          <input type="hidden" name="userId" value={formData.userId} />

          <div>
            <label className="block font-medium mb-1">Script/Stock Name:</label>
            <input
              type="text"
              name="script"
              value={formData.script}
              onChange={handleChange}
              placeholder="e.g., RELIANCE, TCS, INFY"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Number of shares"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Buying Range:</label>
            <input
              type="text"
              name="buyingRange"
              value={formData.buyingRange}
              onChange={handleChange}
              placeholder="e.g., 2400-2450"
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Average Price:</label>
              <input
                type="number"
                step="0.01"
                name="avgPrice"
                value={formData.avgPrice}
                onChange={handleChange}
                placeholder="Average buying price"
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Stop Loss:</label>
              <input
                type="number"
                step="0.01"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
                placeholder="Stop loss price"
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Support Levels (comma separated):</label>
            <input
              type="text"
              name="supportLevels"
              value={formData.supportLevels}
              onChange={handleChange}
              placeholder="e.g., 2350, 2300, 2250"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Resistance Levels (comma separated):</label>
            <input
              type="text"
              name="resistanceLevels"
              value={formData.resistanceLevels}
              onChange={handleChange}
              placeholder="e.g., 2500, 2550, 2600"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Take Profit Targets (comma separated):</label>
            <input
              type="text"
              name="takeProfitTargets"
              value={formData.takeProfitTargets}
              onChange={handleChange}
              placeholder="e.g., 2480, 2520, 2580"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          
           <div>
            <label className="block font-medium mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any notes or setup details about this trade..."
              rows="3"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Exit Plan:</label>
            <textarea
              name="exitPlan"
              value={formData.exitPlan}
              onChange={handleChange}
              placeholder="Describe your exit strategy"
              rows="3"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Trailing Plan:</label>
            <textarea
              name="trailingPlan"
              value={formData.trailingPlan}
              onChange={handleChange}
              placeholder="Describe your trailing stop strategy"
              rows="3"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? "Creating Trade..." : "Create Trade"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrade;
