let Serial = require("serialport");
let express = require("express");
let bodyParser = require("body-parser");
let socket = require("socket.io");
let ReadLine = require("@serialport/parser-readline");
require("dotenv").config();

const app_port = process.env.SRV_PORT | 8080;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  let ports = await Serial.list();
  let port_paths = [];
  ports.forEach((elem) => port_paths.push(elem.path));
  res.render("index", { Ports: port_paths });
});

app.post("/", async (req, res) => {
  res.render("graph", req.body);
});

let srv = app.listen(app_port, () => {
  console.log(`Listening on :${app_port}`);
});

let io = socket(srv, {
  // OPTIONS
});

io.on("connection", (cli) => {
  let serial;
  cli.on("open", (data) => {
    console.log(`Opening ${data.port} @ ${data.baud}`);
    serial = new Serial(data.port, { baudRate: data.baud });
    let parser = new ReadLine();
    serial.pipe(parser);

    parser.on("data", (line) => {
      cli.emit("data", {
        value: line,
      });
    });
  });

  cli.on("close", (data) => {
    if (serial) {
      console.log(`Closing ${data.port} @ ${data.baud}`);
      serial.close();
    }
  });

  cli.on("ports", async (data) => {
    let ports = await Serial.list();
    let port_paths = [];
    ports.forEach((elem) => port_paths.push(elem.path));
    cli.emit("ports", { ports: port_paths });
  });

  cli.on("command", (data) => {
    serial.write(data.command);
  });
});
