
const userModel = require("../models/userModels")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistModel")

/**
 *
 * @name registerController
 * @description This controller will handle user registration logic. It will receive user data from the request, validate it, and then create a new user in the database.
 */
async function registerUser(req, res) {
  const { username, email, password } = req.body;

  //validation
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  //check if user already exists
  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  //create user
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token,{
    httpOnly: true,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
}

/**
 * @name loginUserController
 * @description This controller will handle user login logic. It will receive user credentials from the request, validate them, and then generate a JWT token if the credentials are correct.
 */
async function loginUser(req, res) {
  const { email, username, password } = req.body;

  //validation

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { userId: user._id },
     process.env.JWT_SECRET, 
     {expiresIn: "1d",});

     res.cookie("token", token,{
        httpOnly: true,
        secure: false,
        sameSite: "lax"
     });

     res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            email: user.email,
            username: user.username
        },
        token
     })
}

/**
 * 
 * @name logoutUserController
 * @description this controller will handle user logged out logic
 */
async function logoutUser(req, res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(400).json({
      message: "Token is required"
    })
  }

  await blacklistModel.create({ token });
  
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully"
  })
}

/**
 * @name getMeController
 * @description this controller will return the logged in user data
 */
async function getMe(req, res){

  const user = await userModel.findById(req.user.userId).select("-password");

  res.status(200).json({
    message: "User data fetched",
    user:{
      id: user._id,
      email: user.email,
      username: user.username
    }
  })
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe
};
