const  express = require("express");
const app = express();

const userRoutes = require("./routes/User")
const profileRoutes= require("./routes/Profile")
const paymentRoutes = require("./routes/Payments")
const courseRoutes = require("./routes/Course")
const contactUsRoutes = require("./routes/ContactUs")


const db = require("./config/database")
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary")
require('dotenv').config();
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

db.connect();

cloudinaryConnect();



app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/contact",contactUsRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running....."
    })
})

app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})
