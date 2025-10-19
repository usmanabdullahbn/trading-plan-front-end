"use client";

import { useState, useEffect } from "react";
import { tradeAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, XCircle, CheckCircle2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [editingTrade, setEditingTrade] = useState(null);
  const [editForm, setEditForm] = useState({
    script: "",
    quantity: "",
    avgPrice: "",
    stopLoss: "",
  });

  const navigate = useNavigate();

  // For close trade modal
  const [closingTrade, setClosingTrade] = useState(null);
  const [closeForm, setCloseForm] = useState({
    outcome: "",
    amount: "",
    remarks: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user);
    }
  }, []);

  useEffect(() => {
    if (user?._id) fetchUserTrades(user._id);
  }, [user]);

  const fetchUserTrades = async (userId) => {
    try {
      setLoading(true);
      const response = await tradeAPI.getAllTrades(userId);
      setTrades(response.data?.trades || []);
    } catch (err) {
      console.error("Failed to fetch trades:", err);
      setError("Failed to fetch trades. Please try again later.");
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;
    try {
      await tradeAPI.deleteTrade(tradeId);
      fetchUserTrades(user._id);
    } catch (err) {
      console.error("Delete trade error:", err);
      setError("Failed to delete trade.");
    }
  };

  const handleEditClick = (trade) => {
    setEditingTrade(trade._id);
    setEditForm({
      script: trade.script,
      quantity: trade.quantity,
      avgPrice: trade.avgPrice,
      stopLoss: trade.stopLoss,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (tradeId) => {
    try {
      await tradeAPI.updateTrade(tradeId, {
        script: editForm.script,
        quantity: Number(editForm.quantity),
        avgPrice: Number(editForm.avgPrice),
        stopLoss: Number(editForm.stopLoss),
      });
      setEditingTrade(null);
      fetchUserTrades(user._id);
    } catch (err) {
      console.error("Update trade error:", err);
      setError("Failed to update trade.");
    }
  };

  // Open modal
  const handleCloseTrade = (tradeId) => {
    setClosingTrade(tradeId);
    setCloseForm({ outcome: "", amount: "", remarks: "" });
  };

  // Confirm close
  const confirmCloseTrade = async (tradeId) => {
    if (!closeForm.outcome || closeForm.amount === "") {
      alert("Please select outcome and enter amount.");
      return;
    }

    const amount = Number(closeForm.amount);
    const finalAmount =
      closeForm.outcome === "loss" ? -Math.abs(amount) : Math.abs(amount);

    try {
      await tradeAPI.closeTrade(tradeId, {
        status: "completed",
        outcome: closeForm.outcome,
        profitLoss: finalAmount,
        remarks: closeForm.remarks,
      });
      setClosingTrade(null);
      fetchUserTrades(user._id);
    } catch (err) {
      console.error("Close trade error:", err);
      setError("Failed to close trade.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading trades...
      </div>
    );

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Your Trades</h1>
      </header>

      {trades.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground shadow-sm">
          No trades found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map((trade, i) => (
            <motion.div
              key={trade._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/trade/${trade._id}`)}
            >
              {editingTrade === trade._id ? (
                <>
                  <input
                    type="text"
                    name="script"
                    value={editForm.script}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded-lg text-sm"
                    placeholder="Script"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded-lg text-sm"
                    placeholder="Quantity"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    name="avgPrice"
                    value={editForm.avgPrice}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded-lg text-sm"
                    placeholder="Avg Price"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <input
                    type="number"
                    name="stopLoss"
                    value={editForm.stopLoss}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-2 border rounded-lg text-sm"
                    placeholder="Stop Loss"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit(trade._id);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTrade(null);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {trade.script}
                  </h3>

                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>
                      <strong>Quantity:</strong> {trade.quantity}
                    </p>
                    <p>
                      <strong>Avg Price:</strong> {trade.avgPrice}
                    </p>
                    <p>
                      <strong>Stop Loss:</strong> {trade.stopLoss}
                    </p>
                    <p>
                      <strong>P&L:</strong>{" "}
                      <span
                        className={`font-medium ${
                          (trade.profitLoss || 0) >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {trade.profitLoss || 0}
                      </span>
                    </p>
                    {trade.remarks && (
                      <p className="italic text-gray-500">
                        <strong>Remarks:</strong> {trade.remarks}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Date:</strong>{" "}
                    {new Date(trade.date).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        trade.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {trade.status === "active" ? (
                        <XCircle size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      {trade.status}
                    </span>

                    {trade.outcome && (
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          trade.outcome === "profit"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {trade.outcome}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    {trade.status === "active" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(trade);
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTrade(trade._id);
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition"
                        >
                          <CheckCircle2 size={14} />
                          Close
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrade(trade._id);
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ Close Trade Modal */}
      <AnimatePresence>
        {closingTrade && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setClosingTrade(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 text-center w-80"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-3">Close Trade</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the outcome, enter amount, and add remarks:
              </p>

              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={() =>
                    setCloseForm({
                      ...closeForm,
                      outcome: "win",
                      amount: Math.abs(closeForm.amount),
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    closeForm.outcome === "win"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Profit
                </button>
                <button
                  onClick={() =>
                    setCloseForm({
                      ...closeForm,
                      outcome: "loss",
                      amount: closeForm.amount
                        ? -Math.abs(closeForm.amount)
                        : "",
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    closeForm.outcome === "loss"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Loss
                </button>
              </div>

              <input
                type="number"
                name="amount"
                value={closeForm.amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (closeForm.outcome === "loss") {
                    setCloseForm({ ...closeForm, amount: -Math.abs(val) });
                  } else {
                    setCloseForm({ ...closeForm, amount: Math.abs(val) });
                  }
                }}
                className="w-full border rounded-lg p-2 text-sm mb-3"
                placeholder="Enter amount"
              />

              <textarea
                name="remarks"
                value={closeForm.remarks}
                onChange={(e) =>
                  setCloseForm({ ...closeForm, remarks: e.target.value })
                }
                className="w-full border rounded-lg p-2 text-sm mb-4 resize-none"
                placeholder="Add your remarks (optional)"
                rows="3"
              ></textarea>

              <div className="flex justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmCloseTrade(closingTrade);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClosingTrade(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trades;
