let Serial = require("serialport");
let express = require("express");
let ReadLine = require("@serialport/parser-readline");

const BAUD = [9600, 115200, 230400];

let data = [];
let available_ports = [];

for (let i = 0; i < 1024; i++) {
  data.push(0);
}

Serial.list().then((value) => {
  value.forEach((element) => {
    available_ports.push(element.path);
    main();
  });
});

function main() {
  console.log(`Available Ports:\n\t${available_ports}`);
  console.log("Starting...\n");

  // opening a serial port
  const Port = new Serial("COM3", { baudRate: 230400 });

  // parse data on receiving with parser (async)
  const parser = new ReadLine();
  Port.pipe(parser);
  parser.on("data", (line) => {
    data.shift();
    data[1023] = parseFloat(line);
    console.log(data);
  });
}
