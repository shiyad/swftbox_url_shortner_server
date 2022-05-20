const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HTTP_PORT = process.env.PORT || 3001;

const swftboxUrl = require("./models/swftboxUrl");

mongoose.connect(
  "mongodb+srv://swftbox:swftbox@cluster0.sirfc.mongodb.net/shorturldb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.post("/encode", async (req, res) => {
  await swftboxUrl.create({
    host: req.headers.host,
    fullUrl: req.body.fullUrl,
  });
  res.redirect("/");
});

app.get("/", async (req, res) => {
  const encodedUrls = await swftboxUrl.find();
  res.json(encodedUrls);
});

app.get("/decode", async (req, res) => {
  const decodedUrl = await swftboxUrl.findOne({
    shortUrl: req.body.encodedurl,
  });

  if (decodedUrl === null) return res.sendStatus(404);

  decodedUrl.clicksCounter++;
  decodedUrl.save();

  res.redirect(decodedUrl.fullUrl);
});

app.get("/statistics/:url", async (req, res) => {
  const decodedUrl = await swftboxUrl.findOne({
    shortUrl: req.params.url,
  });
  res.json(decodedUrl);
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
