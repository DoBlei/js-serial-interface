let Serial = require("serialport");
let express = require("express");
let bodyParser = require("body-parser");
let ReadLine = require("@serialport/parser-readline");
require("dotenv").config();

const app_port = process.env.SRV_PORT | 8080;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/data/:PORT/:BAUD", async (req, res) => {
  const port = req.params.PORT;
  const baud = req.params.BAUD;

  let serial = new Serial(port, { baudRate: parseInt(baud) });
  let parser = new ReadLine();

  let data = [];
  let counter = 0;

  serial.pipe(serial);
  parser.on("data", (line) => {
    if (counter < 1024) {
      data.push(parseFloat(line));
      counter++;
    }
  });

  if (counter == 1024) {
    let answer = {
      port,
      baud,
      data,
    };

    data = [];
    res.json(answer);
    serial.close();
  }
});

app.get("/", async (req, res) => {
  let ports = await Serial.list();
  let port_paths = [];
  ports.forEach((elem) => port_paths.push(elem.path));
  res.render("index", { Ports: port_paths });
});

app.post("/", async (req, res) => {
  res.render("graph", req.body);
});

app.listen(app_port);
