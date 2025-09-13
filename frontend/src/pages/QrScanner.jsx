import { useState } from "react";
import QrReader from "react-qr-scanner";
import { scanSerial } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function QRScanner() {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      const scanned = typeof data === "string" ? data : data?.text || data;
      setSerial(scanned);
      checkSerial(scanned);
    }
  };

  const handleError = (err) => console.error(err);

  const checkSerial = async (serialNumber) => {
    try {
      const res = await scanSerial(serialNumber);
      setResult(res);
    } catch (err) {
      console.error(err);
      setResult({ status: "error", message: "Cannot verify serial" });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (serial) checkSerial(serial);
  };

  const resetScan = () => {
    setSerial("");
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 min-h-screen bg-gradient-to-b from-pink-100 via-orange-100 to-yellow-50">
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-orange-700 animate-pulse"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Garba Event Check-In
      </motion.h1>

      {/* QR Scanner */}
      <motion.div
        className="w-full max-w-md mb-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <QrReader delay={350} onError={handleError} onScan={handleScan} style={{ width: "100%" }} 
        constraints={{ facingMode: "environment" }} />
      </motion.div>

      {/* Manual Input */}
      <motion.form
        onSubmit={handleManualSubmit}
        className="flex flex-col items-center w-full max-w-md gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Enter Serial Number.."
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="p-4 w-full border-2 border-pink-300 rounded-2xl text-center text-m font-semibold focus:outline-none focus:ring-4 focus:ring-pink-400 placeholder-pink-600"
        />
        <button className="w-full py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
          Check
        </button>
      </motion.form>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            key={serial}
            className="mt-8 p-6 w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl text-center border border-pink-200 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {result.status === "registered" ? (
              <motion.p
                className="text-green-600 font-extrabold text-3xl flex items-center justify-center gap-3"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                ✅ Assigned!
              </motion.p>
            ) : result.status === "not_registered" ? (
              <motion.p
                className="text-yellow-500 font-extrabold text-3xl flex items-center justify-center gap-3"
                initial={{ x: -10 }}
                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.8 }}
              >
                ⚠️ Already assigned
              </motion.p>
            ) : (
              <p className="text-red-500 font-bold text-xl">{result.message}</p>
            )}

            {/* Check Another Button */}
            <motion.button
              className="mt-4 px-6 py-3 bg-pink-500 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-600 hover:scale-105 transition-transform duration-300"
              onClick={resetScan}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              🔄 Check Another
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
