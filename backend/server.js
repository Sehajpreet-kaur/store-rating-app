require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {sequelize} = require("./models");
const authRouter = require("./routes/auth/auth-routes.js");
const adminRouter = require("./routes/admin/admin-routes.js");
const userRouter = require("./routes/user/user-routes.js");
const storeOwnerRouter = require("./routes/store_owner/store_owner-routes.js");

const app = express();
app.use(cors({
      origin:process.env.CLIENT_BASE_URL || 'http://localhost:5173',
      methods:['GET','POST','DELETE','PUT'],
      allowedHeaders:[
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
      ],
      credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "Backend is running" }));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/owner", storeOwnerRouter);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("MySQL connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Tables synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));