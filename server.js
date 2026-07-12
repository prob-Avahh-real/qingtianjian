// 青天见 · Node.js Backend
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "www")));

// ========== OpenStreetMap Geocoding ==========
app.get("/api/geocode", async (req, res) => {
  const city = req.query.q;
  if (!city) return res.status(400).json({ error: "Missing city name" });
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
      { headers: { "User-Agent": "QingTianJian/2.0" } }
    );
    const data = await resp.json();
    if (data.length === 0) return res.json({ found: false });
    res.json({
      found: true,
      name: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    });
  } catch (e) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// ========== Health ==========
app.get("/api/health", (_, res) => res.json({ status: "ok", version: "2.0" }));

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => console.log(`🌟 青天见 back-end @ http://localhost:${PORT}`));
