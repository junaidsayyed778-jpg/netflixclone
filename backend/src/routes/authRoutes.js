const express = require("express");
const { registerUser, loginUser, logoutUser, getMe } = require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
/** 
* @routes POST /api/auth/register
* @description Register a new user
* @access public
*/
router.post("/register", registerUser)

/**
 * @routes POST /api/auth/login
 * @description Login a user
 * @access public
 */
router.post("/login", loginUser)

/**
 * @routtes POST /api/auth/logout
 * @description logout a user
 * @access private
 */
router.post("/logout", logoutUser)

/**
 * @routes GET /api/auth/me
 * @description Get current logged in user
 */
router.get("/me",authMiddleware, getMe)
module.exports = router;