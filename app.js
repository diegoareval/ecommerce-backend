const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config()

// import routes 
const userRoutes = require("./routes/user")
// app
const app = express();

// database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => console.log("database connected"))

// routes middleware
app.use("/api",userRoutes)

const port = process.env.PORT || 8000

app.listen(port, () =>{
  console.log("the port is: " + port)
})