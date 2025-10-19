"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tradeAPI } from "../services/api";
import {
  Plus,
  Briefcase,
  Activity,
  CheckCircle,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTrades: 0,
    activeTrades: 0,
    completedTrades: 0,
    totalProfit: 0,
    winRatio: 0,
    losingTrades: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData(user.user);
  }, [user]);

  const fetchDashboardData = async (user) => {
    try {
      setLoading(true);
      const response = await tradeAPI.getAllTrades(user._id);
      const allTrades = response.data?.trades || [];

      const activeTrades = allTrades.filter((t) => t.status === "active").length;
      const completedTradesList = allTrades.filter(
        (t) => t.status === "completed"
      );
      const completedTrades = completedTradesList.length;

      const totalPnL = allTrades.reduce(
        (sum, t) => sum + Number(t.profitLoss || 0),
        0
      );

      const winningTrades = completedTradesList.filter(
        (t) => Number(t.profitLoss) > 0
      ).length;
      const losingTrades = completedTradesList.filter(
        (t) => Number(t.profitLoss) < 0
      ).length;

      const winRatio =
        completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0;

      setStats({
        totalTrades: allTrades.length,
        activeTrades,
        completedTrades,
        totalProfit: totalPnL,
        winRatio,
        losingTrades,
      });
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-sm text-muted-foreground animate-pulse">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      </div>
    );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  const statsData = [
    {
      label: "Total Trades",
      value: stats.totalTrades,
      color: "text-blue-600",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      route: "/trades",
    },
    {
      label: "Active Trades",
      value: stats.activeTrades,
      color: "text-green-600",
      icon: <Activity className="h-5 w-5 text-green-600" />,
      iconBg: "bg-green-100",
      route: "/active",
    },
    {
      label: "Completed Trades",
      value: stats.completedTrades,
      color: "text-purple-600",
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-100",
      route: "/completed",
    },
    {
      label: "Winning Trades",
      value: Math.round((stats.totalTrades * stats.winRatio) / 100),
      color: "text-emerald-600",
      icon: <Trophy className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-100",
      route: "/win-trades",
    },
    {
      label: "Losing Trades",
      value: stats.losingTrades,
      color: "text-red-600",
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      iconBg: "bg-red-100",
      route: "/loss-trades",
    },
    {
      label: "Win Ratio",
      value: stats.winRatio,
      color: stats.winRatio >= 50 ? "text-emerald-600" : "text-red-600",
      suffix: "%",
      icon: (
        <Trophy
          className={`h-5 w-5 ${
            stats.winRatio >= 50 ? "text-emerald-600" : "text-red-600"
          }`}
        />
      ),
      iconBg: stats.winRatio >= 50 ? "bg-emerald-100" : "bg-red-100",
      route: "/win-ratio",
    },
    {
      label: "Total P&L",
      value: stats.totalProfit,
      color: stats.totalProfit >= 0 ? "text-emerald-600" : "text-red-600",
      icon: (
        <TrendingUp
          className={`h-5 w-5 ${
            stats.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        />
      ),
      iconBg: stats.totalProfit >= 0 ? "bg-emerald-100" : "bg-red-100",
      route: "/P&L",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          Welcome, {user?.user.name || "Trader"}
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/create-trade")}
            className="group relative inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md ring-1 ring-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Plus className="size-4" />
            <span>New Trade</span>
          </button>

          <button
            onClick={() => navigate("/trades")}
            className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-md ring-1 ring-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span>View Trades</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => navigate(item.route)}
            className="cursor-pointer rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>

            <p className={`mt-3 text-3xl font-semibold ${item.color}`}>
              <CountUp
                start={0}
                end={Number(item.value) || 0}
                duration={1.4}
                decimals={item.label === "Win Ratio" ? 2 : 0}
                suffix={item.suffix || ""}
              />
            </p>

            {item.label === "Win Ratio" && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(0, Math.min(100, stats.winRatio))}%`,
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
