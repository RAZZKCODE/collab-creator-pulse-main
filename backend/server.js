import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// --- Route Imports ---
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import accountRoutes from './routes/accountRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:8080").split(',');

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or server-to-server requests)
        // and requests from the allowed origins list.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// --- Middlewares ---
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));


// --- API Route Registration ---
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/submissions", submissionRoutes); // <-- THIS LINE IS NOW FIXED
app.use('/api/accounts', accountRoutes);


// --- Health Check Route ---
app.get("/api/health", (req, res) => res.json({ status: "ok" }));


// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});