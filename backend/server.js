// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// routes
import campaignsRouter from "./routes/campaignRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express(); // ⬅️ The 'app' object must be initialized here.

app.use(cors());
app.use(express.json());

// health
app.get("/", (req, res) => {
  res.send("Welcome to the CreatorPulse API! Go to /api/campaigns to see data.");
});

// debug PUT to verify PUT handling (temporary)
app.put("/debug/put-test/:id", (req, res) => {
  console.log("DEBUG PUT received", { params: req.params, body: req.body });
  res.json({ ok: true, params: req.params, body: req.body });
});

// mount campaigns router (must be after express.json and cors)
app.use("/api/auth", authRoutes); // ⬅️ Now this line correctly uses the 'app' object.
app.use("/api/campaigns", campaignsRouter);

// route inspector (temporary; remove in production)
// robust route inspector (safe if app._router is not yet initialized)
function printRoutes(app) {
  console.log("=== Registered routes ===");

  if (!app || !app._router || !Array.isArray(app._router.stack)) {
    console.log("No routes registered yet (app._router is undefined or empty).");
    console.log("Make sure you call printRoutes AFTER mounting routers (app.use(...)).");
    console.log("=== End routes ===");
    return;
  }

  const seen = new Set();
  app._router.stack.forEach((layer) => {
    if (!layer) return;
    // direct routes on app
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(", ");
      console.log(`${methods} ${layer.route.path}`);
      seen.add(`${methods} ${layer.route.path}`);
    }
    // mounted router
    else if (layer.name === "router" && layer.handle && Array.isArray(layer.handle.stack)) {
      layer.handle.stack.forEach((handler) => {
        if (handler.route && handler.route.path) {
          const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(", ");
          const txt = `${methods} ${handler.route.path}`;
          if (!seen.has(txt)) {
            console.log(txt);
            seen.add(txt);
          }
        }
      });
    }
  });

  console.log("=== End routes ===");
}

// call after mounting routers
printRoutes(app);


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));