import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Trades from "./pages/Trades"
import CreateTrade from "./pages/CreateTrade"
import Users from "./pages/Users"
import GoogleLogin from "./pages/CreateUser"
import Active from "./Dashbord pages/Active"
import TradeDetails from "./pages/TradeDetails"
import Compeleted from "./Dashbord pages/Compeleted"
import WinTrades from "./Dashbord pages/WinTrades"
import LossTrades from "./Dashbord pages/LossTrades"
import WinRatio from "./Dashbord pages/WinRatio"
import PnL from "./Dashbord pages/total-p&L"

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/trade/:id" element={<TradeDetails />} />
            <Route path="/create-trade" element={<CreateTrade />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<GoogleLogin />} />

            <Route path="/active" element={<Active />} />
            <Route path="/completed" element={<Compeleted />} />
            <Route path="/win-trades" element={<WinTrades />} />
            <Route path="/loss-trades" element={<LossTrades />} />
            <Route path="/win-ratio" element={<WinRatio />} />
            <Route path="/P&L" element={<PnL />} />

          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
