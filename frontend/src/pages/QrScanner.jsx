import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { scanSerial } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function QRScanner() {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [videoDevices, setVideoDevices] = useState([]);
  const [mode, setMode] = useState("qr"); // 'qr' or 'manual'
  const videoRef = useRef(null);
  const lastScanned = useRef("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .listVideoInputDevices()
      .then((devices) => setVideoDevices(devices))
      .catch(console.error);
  }, []);
useEffect(() => {
  if (!videoDevices.length || mode !== "qr") return;

  const codeReader = new BrowserMultiFormatReader();
  let active = true;

  const selectedDevice =
    videoDevices.find((d) =>
      facingMode === "environment"
        ? d.label.toLowerCase().includes("back")
        : d.label.toLowerCase().includes("front")
    ) || videoDevices[0];

  codeReader
    .decodeFromVideoDevice(selectedDevice.deviceId, videoRef.current, (res, err) => {
      if (!active) return;

      if (res) {
        const scanned = res.getText();
        if (scanned !== lastScanned.current) {
          lastScanned.current = scanned;
          setSerial(scanned);
          checkSerial(scanned);
        }
      }

      (err) => { if (err && err.name !== "NotFoundException") console.error(err);
      
      }
    })
    .catch((err) => console.error("Camera access denied or error:", err));

  return () => {
    active = false;
    codeReader.reset(); // STOP the scanner when unmounting or switching mode
  };
}, [facingMode, videoDevices, mode]);


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
    if (serial) {
      lastScanned.current = serial;
      checkSerial(serial);
    }
  };

  const resetScan = () => {
    setSerial("");
    setResult(null);
    lastScanned.current = "";
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 min-h-screen bg-gradient-to-b from-pink-100 via-orange-100 to-yellow-50">
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-orange-700 animate-pulse"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Garba Event Check-In
      </motion.h1>

      {/* Sliding Toggle */}
      <div
        className="relative w-60 h-10 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer mb-4"
        onClick={() => setMode(mode === "qr" ? "manual" : "qr")}
      >
        <motion.div
          className="absolute w-1/2 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ left: mode === "qr" ? 0 : "50%" }}
        />
        <div className="flex justify-between w-full px-2 text-white font-bold z-10 text-sm select-none">
          <span className={mode === "qr" ? "text-white" : "text-gray-700"}>
            QR
          </span>
          <span className={mode === "manual" ? "text-white" : "text-gray-700"}>
            Manual
          </span>
        </div>
      </div>

      {/* Camera Toggle */}
      {mode === "qr" && (
        <button
          onClick={toggleCamera}
          className="mb-4 px-6 py-2 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-xl shadow hover:scale-105 transition-transform duration-300"
        >
          Switch to {facingMode === "environment" ? "Front" : "Back"} Camera
        </button>
      )}

      {/* QR Scanner */}
      {mode === "qr" && (
        <motion.div
          className="w-full max-w-md mb-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-300 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <video ref={videoRef} style={{ width: "100%" }} muted autoPlay />
        </motion.div>
      )}

      {/* Manual Entry */}
      {mode === "manual" && (
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
          <button
            disabled={!serial}
            className={`w-full py-4 text-xl font-bold rounded-2xl shadow-lg transition-transform duration-300 ${
              serial
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:scale-105 hover:shadow-xl"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Check
          </button>
        </motion.form>
      )}

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
