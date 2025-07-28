const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const prentsDetailsRoutes = require("./routes/ParentsDetails");
// const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const classRouter = require("./routes/Class");
const sectionRouter = require("./routes/Section");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/prentsDetails", prentsDetailsRoutes);
app.use("/api/v1/class", classRouter);
app.use("/api/v1/class", classRouter);
app.use("/api/v1/section", sectionRouter);
// app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.use((err, req, res, next) => {
  let { statusCode = "500", message = "Some error Occured" } = err;
  res.status(statusCode).json({ success: false, message: message });
  next(err);
});

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
