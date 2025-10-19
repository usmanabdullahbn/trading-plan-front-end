"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tradeAPI } from "../services/api";
import { ArrowLeft } from "lucide-react";

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrade();
  }, [id]);

  const fetchTrade = async () => {
    try {
      const response = await tradeAPI.getTrade(id);
      setTrade(response.data.trade);
    } catch (err) {
      console.error("Failed to fetch trade:", err);
      setError("Failed to fetch trade details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading trade details...
      </div>
    );

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;
  if (!trade) return <div className="p-6 text-gray-500">No trade found.</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sm text-gray-700 hover:text-blue-600 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Main Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800 capitalize tracking-tight">
            {trade.script}
          </h2>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
              trade.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {trade.status}
          </span>
        </div>

        {/* Date */}
        <p className="text-sm text-gray-500">
          <strong>Date:</strong>{" "}
          {new Date(trade.date).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>

        {/* Description */}
        {trade.description && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border text-sm">
            <strong className="block mb-1 text-gray-700">Description:</strong>
            <p className="text-gray-600 leading-relaxed">{trade.description}</p>
          </div>
        )}

        {/* Basic Details */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Quantity:</strong> {trade.quantity}
          </p>
          <p>
            <strong>Average Price:</strong> {trade.avgPrice}
          </p>
          <p>
            <strong>Buying Range:</strong> {trade.buyingRange || "—"}
          </p>
          <p>
            <strong>Stop Loss:</strong> {trade.stopLoss}
          </p>
        </div>

        {/* Support & Resistance */}
        {(trade.supportLevels?.length > 0 ||
          trade.resistanceLevels?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {trade.supportLevels?.length > 0 && (
              <div className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition">
                <strong className="block mb-2 text-gray-700">
                  Support Levels:
                </strong>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {trade.supportLevels.map((level, idx) => (
                    <li key={idx}>{level}</li>
                  ))}
                </ul>
              </div>
            )}

            {trade.resistanceLevels?.length > 0 && (
              <div className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition">
                <strong className="block mb-2 text-gray-700">
                  Resistance Levels:
                </strong>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {trade.resistanceLevels.map((level, idx) => (
                    <li key={idx}>{level}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Take Profit Targets */}
        {trade.takeProfitTargets?.length > 0 && (
          <div className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition">
            <strong className="block mb-2 text-gray-700">
              Take Profit Targets:
            </strong>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {trade.takeProfitTargets.map((target, idx) => (
                <li key={idx}>{target}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Exit & Trailing Plan */}
        <div className="grid sm:grid-cols-2 gap-4">
          {trade.exitPlan && (
            <div className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition">
              <strong className="block mb-1 text-gray-700">Exit Plan:</strong>
              <p className="text-gray-600">{trade.exitPlan}</p>
            </div>
          )}
          {trade.trailingPlan && (
            <div className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition">
              <strong className="block mb-1 text-gray-700">Trailing Plan:</strong>
              <p className="text-gray-600">{trade.trailingPlan}</p>
            </div>
          )}
        </div>

        {/* Remarks */}
        {trade.remarks && (
          <div className="bg-gray-50 rounded-xl p-5 border text-sm">
            <strong className="block mb-1 text-gray-700">Remarks:</strong>
            <p className="italic text-gray-600">{trade.remarks}</p>
          </div>
        )}

        {/* Outcome & Profit / Loss - at the very end */}
        <div className="pt-6 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Outcome:{" "}
              <span
                className={`font-semibold ${
                  trade.outcome === "profit"
                    ? "text-emerald-600"
                    : trade.outcome === "loss"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {trade.outcome || "—"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Profit / Loss:{" "}
              <span
                className={`text-lg font-semibold ${
                  (trade.profitLoss || 0) >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {trade.profitLoss || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
