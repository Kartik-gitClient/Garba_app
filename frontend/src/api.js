const API_URL = "https://gokulrass.onrender.com/api";

export async function scanSerial(serialNumber, assignedTo = "Guest") {
  const res = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serialNumber, assignedTo }),
  });
  return res.json();
}

export async function getAllEntries() {
  const res = await fetch(`${API_URL}/admin/all`);
  return res.json();
}
