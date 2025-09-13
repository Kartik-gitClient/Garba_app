import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QrScanner from "./pages/QrScanner";
import AdminDashboard from "./pages/AdminDashboard";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-orange-100 to-yellow-50 flex flex-col">
      {/* Navbar */}
      <motion.nav
        className="bg-white/80 backdrop-blur-md shadow-xl p-4 flex justify-between items-center sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        <div className="flex flex-row flex-wrap gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl font-semibold text-orange-500 hover:bg-orange-200 hover:text-orange-700 border-2 border-amber-600 transition"
          >
            QR Entry
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl font-semibold text-pink-500 hover:bg-pink-200 hover:text-pink-700 border-2 border-pink-600 transition"
          >
            Admin Div
          </Link>
        </div>
      </motion.nav>

      {/* Pages */}
      <main className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-2xl">
          <Routes>
            <Route path="/" element={<QrScanner />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white/80 backdrop-blur-md text-center p-3 text-sm text-orange-500 shadow-inner"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        © {new Date().getFullYear()} Garba Event
      </motion.footer>
    </div>
  );
}

export default App;
