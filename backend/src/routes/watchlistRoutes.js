const express = require("express")
const { getWatchlist, addToWatchlist, removeWatchlist } = require("../controller/addWatchlist")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

// @route 
router.get("/", authMiddleware, getWatchlist)

router.post("/add", authMiddleware, addToWatchlist)

router.delete("/:movieId", authMiddleware, removeWatchlist)

module.exports = router