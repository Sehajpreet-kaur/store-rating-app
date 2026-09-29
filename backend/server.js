require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const authRouter = require("./routes/auth/auth-routes.js");
const adminRouter = require("./routes/admin/admin-routes.js");
const userRouter = require("./routes/user/user-routes.js");
const storeOwnerRouter = require("./routes/store_owner/store_owner-routes.js");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "Backend is running" }));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/owner", storeOwnerRouter);

const PORT = process.env.PORT || 5000;

process.on("unhandledRejection", (e) => { console.error("Unhandled rejection:", e); process.exit(1); });
process.on("uncaughtException", (e) => { console.error("Uncaught exception:", e); process.exit(1); });

const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing environment variables:", missing.join(", "));
  process.exit(1);
}

console.log(
  `Connecting to ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME} (ssl=${process.env.DB_SSL === "true"}, ca=${Boolean(process.env.DB_SSL_CA)})`
);

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Tables synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Startup failed:", err.message);
    console.error(err);
    process.exit(1);
  });
  