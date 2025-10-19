"use client";

import { useEffect, useState } from "react";
import { tradeAPI } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, PieChart as PieIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = ["#10B981", "#EF4444"]; // Green for win, Red for loss

const WinRatio = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winTrades: 0,
    lossTrades: 0,
    winRatio: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ 1. Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user || parsed);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ 2. Fetch trade stats once user is set
  useEffect(() => {
    if (!user?._id) return;

    const fetchStats = async () => {
      try {
        const res = await tradeAPI.getAllTrades(user._id);
        const trades = res.data?.trades || res.data || [];

        const completedTrades = trades.filter(
          (t) => t.status?.toLowerCase() === "completed"
        );

        const winTrades = completedTrades.filter((t) => t.profitLoss > 0).length;
        const lossTrades = completedTrades.filter((t) => t.profitLoss <= 0).length;
        const totalTrades = winTrades + lossTrades;
        const winRatio = totalTrades
          ? ((winTrades / totalTrades) * 100).toFixed(2)
          : 0;

        setStats({
          totalTrades,
          winTrades,
          lossTrades,
          winRatio,
        });

        setData([
          { name: "Winning Trades", value: winTrades },
          { name: "Losing Trades", value: lossTrades },
        ]);
      } catch (err) {
        console.error("Failed to fetch trade stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2 mb-3">
          <PieIcon className="text-indigo-600" /> Win Ratio
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Pie Chart */}
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="space-y-4 bg-card p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p>
              Total Completed Trades:{" "}
              <span className="font-medium">{stats.totalTrades}</span>
            </p>
            <p className="text-emerald-500">
              Winning Trades:{" "}
              <span className="font-medium">{stats.winTrades}</span>
            </p>
            <p className="text-red-500">
              Losing Trades:{" "}
              <span className="font-medium">{stats.lossTrades}</span>
            </p>
            <p className="text-indigo-500 font-semibold text-lg mt-4">
              Win Ratio: {stats.winRatio}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinRatio;
