import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes";
import speakerRoutes from "./routes/speakerRoutes";
import eventRoutes from "./routes/eventRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  /\.vercel\.app$/,
],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Event Management System API",
    author: "Irfan Maulan Saputra - 24090107",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/events", eventRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📅 Event Management System API - Irfan Maulan Saputra (24090107)`);
});

export default app;
