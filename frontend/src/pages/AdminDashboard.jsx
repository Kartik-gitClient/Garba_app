import { useEffect, useState } from "react";
import { getAllEntries } from "../api";

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getAllEntries().then(setEntries);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
        📋 Admin Dashboard
      </h1>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-orange-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-orange-700">SNo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-orange-700">Serial</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-orange-700">Assigned</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-orange-700">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((e) => (
              <tr key={e._id} className="hover:bg-orange-50 transition">
                <td className="px-4 py-2">{e.SNo}</td>
                <td className="px-4 py-2">{e.SerialNumber}</td>
                <td className="px-4 py-2">{e.IsAssigned ? "✅" : "❌"}</td>
                <td className="px-4 py-2">{e.assignedTo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
