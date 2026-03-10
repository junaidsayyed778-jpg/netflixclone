require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB()

app.listen(process.env.PORT || 3000, () =>{
    console.log("server running on port " + (process.env.PORT || 3000))
})