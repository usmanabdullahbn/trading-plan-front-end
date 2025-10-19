"use client";

import { useEffect, useState } from "react";
import { tradeAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowLeft, LineChart, TrendingUp } from "lucide-react";

const PnL = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totals, setTotals] = useState({ profitLoss: 0, gainPercent: 0 });
  const navigate = useNavigate();

  // ✅ Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user || parsed);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch P&L data
  useEffect(() => {
    if (!user?._id) return;

    const fetchPnLData = async () => {
      try {
        const res = await tradeAPI.getAllTrades(user._id);
        const trades = res.data?.trades || res.data || [];

        const completedTrades = trades.filter(
          (t) => t.status?.toLowerCase() === "completed"
        );

        const processed = completedTrades.map((trade) => {
          const buyingAvg = parseFloat(trade.avgPrice) || 0;
          const qty = parseFloat(trade.quantity) || 0;
          const profitLoss = parseFloat(trade.profitLoss) || 0;
          const sellingAvg =
            qty > 0 ? buyingAvg + profitLoss / qty : buyingAvg;
          const gainPercent =
            buyingAvg > 0 ? ((sellingAvg - buyingAvg) / buyingAvg) * 100 : 0;

          return {
            name: trade.script || "N/A",
            buyingAvg: buyingAvg.toFixed(2),
            sellingAvg: sellingAvg.toFixed(2),
            quantity: qty,
            profitLoss: profitLoss.toFixed(2),
            gainPercent: gainPercent.toFixed(2),
          };
        });

        const totalProfitLoss = processed.reduce(
          (sum, t) => sum + parseFloat(t.profitLoss),
          0
        );
        const avgGainPercent =
          processed.length > 0
            ? processed.reduce((sum, t) => sum + parseFloat(t.gainPercent), 0) /
              processed.length
            : 0;

        setData(processed);
        setTotals({
          profitLoss: totalProfitLoss.toFixed(2),
          gainPercent: avgGainPercent.toFixed(2),
        });
      } catch (err) {
        console.error("Failed to fetch P&L data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPnLData();
  }, [user]);

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "buyingAvg", header: "Buying Avg" },
    { accessorKey: "sellingAvg", header: "Selling Avg" },
    { accessorKey: "quantity", header: "Qty" },
    {
      accessorKey: "profitLoss",
      header: "Profit / Loss (Rs)",
      cell: ({ getValue }) => {
        const val = parseFloat(getValue());
        return (
          <span className={val >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {val >= 0 ? "+" : ""}
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "gainPercent",
      header: "Net Gain (%)",
      cell: ({ getValue }) => {
        const val = parseFloat(getValue());
        return (
          <span className={val >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {val >= 0 ? "+" : ""}
            {val}%
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen w-[100vw] text-gray-800 p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-1 text-blue-600">
            <LineChart className="text-blue-500" /> P&L Report
          </h1>
          <p className="text-gray-500 text-sm">
            Track your performance, profits, and overall gain ratio
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-blue-300 bg-white hover:bg-blue-50 text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </header>

      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No completed trades found.</p>
      ) : (
        <div className="space-y-8">
          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg-white border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100 text-blue-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-5 py-3 text-left font-semibold border-b border-gray-200"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`transition ${
                      i % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100/50`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-5 py-3 border-b border-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="text-green-500" size={20} />
                <h2 className="text-lg font-semibold text-green-600">
                  Total Profit / Loss
                </h2>
              </div>
              <p
                className={`text-3xl font-bold ${
                  totals.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totals.profitLoss >= 0 ? "+" : ""}
                {totals.profitLoss} Rs
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Combined net performance of all completed trades
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <LineChart className="text-blue-500" size={20} />
                <h2 className="text-lg font-semibold text-blue-600">
                  Average Gain %
                </h2>
              </div>
              <p
                className={`text-3xl font-bold ${
                  totals.gainPercent >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totals.gainPercent >= 0 ? "+" : ""}
                {totals.gainPercent}%
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Average percentage gain/loss across all trades
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnL;
