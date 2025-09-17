import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Serve SPA-ish routes if needed
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`GloWerkz server running on http://localhost:${PORT}`);
});
