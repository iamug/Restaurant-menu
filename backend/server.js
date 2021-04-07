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
morgan.token("admin", function (req, res, param) {
  return (req.user && req.user.name) || "";
});
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
app.use(express.json({ extended: false }));

//Upload Endpoint
app.use("/upload", auth, async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  console.log(file.mimetype);
  const key = `Commute-Bucket-Oct-2020/${req.user.id}/${uuidv4()}-${file.name}`;
  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "commute-partner-s3-bucket",
      ContentType: file.mimetype,
      Key: key,
    },
    async (err, url) => {
      res.status(200).json({ key, url });
    }
  );
});

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user/auth", require("./routes/api/auth-user"));
app.use("/api/profile", require("./routes/api/profile"));
//app.use("/api/dashboard", require("./routes/api/dashboard"));
// app.use("/api/payments", require("./routes/api/payments"));
app.use("/api/admins", require("./routes/api/admins"));
app.use("/api/products", require("./routes/api/products"));
app.use("/api/category", require("./routes/api/category"));

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));
//app.listen(4000, () => console.log(`Server stated on port ${4000}`));
