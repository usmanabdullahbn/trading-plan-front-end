"use client";

import { useState, useEffect } from "react";
import { tradeAPI } from "../services/api";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LossTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user);
    }
  }, []);

  useEffect(() => {
    if (user?._id) fetchLossTrades(user._id);
  }, [user]);

  const fetchLossTrades = async (userId) => {
    try {
      setLoading(true);
      const response = await tradeAPI.getAllTrades(userId);
      const lossTrades = (response.data?.trades || []).filter(
        (t) => t.status === "completed" && Number(t.profitLoss) < 0
      );
      setTrades(lossTrades);
    } catch (err) {
      console.error("Failed to fetch loss trades:", err);
      setError("Failed to fetch loss trades. Please try again later.");
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;
    try {
      await tradeAPI.deleteTrade(tradeId);
      fetchLossTrades(user._id);
    } catch (err) {
      console.error("Delete trade error:", err);
      setError("Failed to delete trade.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading losing trades...
      </div>
    );

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6">
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          <TrendingDown className="text-red-600" /> Losing Trades
        </h1>

        {/* Back button below heading */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </header>

      {trades.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground shadow-sm">
          No losing trades found.
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
                  <strong>P&L:</strong>{" "}
                  <span className="text-red-600 font-medium">
                    {trade.profitLoss}
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
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  <TrendingDown size={14} /> Loss
                </span>
              </div>

              <div className="flex gap-3 mt-4">
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LossTrades;
