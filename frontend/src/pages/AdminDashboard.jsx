import { useEffect, useState } from "react";
import { getAllEntries } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const PASSWORD = "admin123"; // change this to a stronger password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("❌ Wrong password");
    }
  };

  useEffect(() => {
    if (authenticated) getAllEntries().then(setEntries);
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <motion.form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-4">🔒 Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </motion.form>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📋 Admin Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg border border-gray-200">
          <thead className="bg-blue-100 rounded-t-2xl">
            <tr>
              {["SNo", "Serial", "Assigned", "Assigned To"].map((col) => (
                <th key={col} className="p-3 text-left text-blue-700 font-semibold border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <motion.tr
                key={e._id}
                className="hover:bg-blue-50 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 border-b">{e.SNo}</td>
                <td className="p-3 border-b">{e.SerialNumber}</td>
                <td className={`p-3 border-b ${e.IsAssigned ? "text-green-600" : "text-red-500"}`}>
                  {e.IsAssigned ? "✅" : "❌"}
                </td>
                <td className="p-3 border-b">{e.assignedTo || "-"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
