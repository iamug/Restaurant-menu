const express = require("express");
const connectDB = require("./config/db");
const config = require("config");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const auth = require("./middleware/auth");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");
const { cloudinary } = require("./utils/cloudinary");
const https = require("https");
const http = require("http");
const LogStream = fs.createWriteStream(path.join(__dirname, `logs.log`), {
  flags: "a",
});

const appLogStream = rfs.createStream("app.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});
const successLogStream = rfs.createStream("success.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});

const s3 = new AWS.S3({
  accessKeyId: config.get("accessKeyId"),
  secretAccessKey: config.get("secretAccessKey"),
  region: "eu-west-2",
});

const app = express();

//connect Database
connectDB();
app.use(cors());
morgan.token("admin", (req, res, param) => (req.user && req.user.name) || "");
app.use(
  morgan("combined", {
    skip: (req, res) => {
      return res.statusCode > 400;
    },
    stream: successLogStream,
  })
);
app.use(morgan("combined", { stream: appLogStream }));
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] -:admin  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { interval: "7d", stream: LogStream }
  )
);

app.use(fileUpload());

// Init Middleware
app.use(express.json({ extended: true, limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

//Upload Endpoint
app.use("/upload", auth, async (req, res) => {
  if (req.body.data === null)
    return res.status(400).json({ msg: "No file uploaded" });
  const file = req.body.data;
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: "baretag",
      folder: `baretag/${req.user.id}`,
    });
    if (!uploadResponse) return res.status(417).json({ msg: "Upload error" });
    res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.get("/", (req, res) => res.send("API Running"));

//Define User Routes
app.use("/api/user/auth", require("./routes/api/user/auth"));
app.use("/api/user/products", require("./routes/api/user/products"));
app.use("/api/user/category", require("./routes/api/user/category"));
app.use("/api/user/orders", require("./routes/api/user/orders"));
app.use("/api/user/tables", require("./routes/api/user/tables"));
app.use("/api/user/tablecategory", require("./routes/api/user/tableCategory"));

//Define Admin Routes
app.use("/api/admin/users", require("./routes/api/admin/users"));
app.use("/api/admin/auth", require("./routes/api/admin/auth"));
app.use("/api/admin/admins", require("./routes/api/admin/admins"));
app.use("/api/admin/products", require("./routes/api/admin/products"));
app.use("/api/admin/category", require("./routes/api/admin/category"));
app.use("/api/admin/orders", require("./routes/api/admin/orders"));

//Define Guest Routes
app.use("/api/guest/products", require("./routes/api/guest/products"));
app.use("/api/guest/users", require("./routes/api/guest/users"));
app.use("/api/guest/categories", require("./routes/api/guest/categories"));
app.use("/api/guest/orders", require("./routes/api/guest/orders"));

const PORT = process.env.PORT || 8000;

//app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
//app.listen(4000, () => console.log(`Server stated on port ${4000}`));


//const PORT = process.env.PORT || 5000;

//app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));


// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/app.baretag.co/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/app.baretag.co/fullchain.pem'),
}, app);

/* httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
}); */

httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT} 443`);
});

