const express = require("express");
const authRoutes = require("./routes/authRoutes")
const watchListRoutes = require("./routes/watchlistRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();
app.use(cookieParser())
app.use(cors({
    origin: "https://netflixclone-frontend-tizx.onrender.com",
    credentials: true
}))
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/watchlist", watchListRoutes)
module.exports = app
