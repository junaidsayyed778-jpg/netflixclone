import express from "express"
const searchRoutes = require("../controller/movieController")

const router = express.Router();

router.get("/", searchRoutes)