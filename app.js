const express = require("express");
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

// api doc
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");

// import routes 
const authRoutes = require("./routes/auth")
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const brainTreeRoutes = require("./routes/braintree")
// app
const app = express();

// database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => console.log("database connected"))


// midlewares 
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes middleware
app.use("/api",authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", brainTreeRoutes)

const port = process.env.PORT || 8000

app.listen(port, () =>{
  console.log("the port is: " + port)
})