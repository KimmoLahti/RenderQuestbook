var express = require("express");
var app = express();
const fs = require("fs");
var axios = require("axios");
const path = require("path");
const router = express.Router();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", router);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/questbook", (req, res) => {
  const filePath = path.join(__dirname, "users.json");
  const rawData = fs.readFileSync(filePath);
  const data = JSON.parse(rawData);
  res.render("questbook", { data });
});

app.get("/newmessage", function(req, res) {
  res.sendFile(__dirname + "/newmessage.html");
});

app.get("/ajaxmessage", function(req, res) {
  res.sendFile(__dirname + "/ajaxmessage.html");
});

app.post("/adduser", (req, res) => {
  const formData = req.body;
  formData.id = new Date().getTime();
  formData.timestamp = new Date();
  fs.readFile("users.json", (err, data) => {
    if (err) throw err;
    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    users.push(formData);
    fs.writeFile("users.json", JSON.stringify(users), err => {
      if (err) throw err;
      console.log("Data saved to file.");
      res.redirect("/newmessage");
    });
  });
});

app.post("/addajaxuser", (req, res) => {
  const name = req.body.name;
  const country = req.body.country;
  const message = req.body.message;

  const timestamp = new Date().toLocaleString();

  const id = new Date().getTime();

  console.log("Data saved successfully");

  const data = `${name},${country},${message},${id},${timestamp}\n`;
  fs.appendFile("messages.txt", data, err => {
    if (err) {
      console.error("Error saving data:", error);
    }
  });

  res.render("ajaxmessage", { name, country, message, id, timestamp });
});

module.exports = router;

app.get("/ajaxmessages", (req, res) => {
  fs.readFile("messages.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    const messages = data
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => {
        const [name, country, message, id, timestamp] = line.split(",");
        return { name, country, message, id, timestamp };
      });

    res.json(messages);
  });
});

app.get("/app.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/app.js");
});

app.listen(8081, function() {
  console.log("Testi app kuuntelee porttia http://localhost:8081/");
});
