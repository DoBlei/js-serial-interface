# Javascript Serial Interface

## overview

This little project should allow the user to connect to a serial port via a web interface and display the received data in a graph. The port and baud rate should be selected before connecting to the device.

## ToDo

- [x] check reading from serial --> serialport node package
- [x] listing available serial ports
- [x] read data in request handler
- [x] display data (real-time)
  - [x] pause/continue
  - [x] export current snapshot as csv
- [ ] error checking
  - [ ] no port/no baud rate chosen
  - [x] refresh available ports
  - [ ] disable currently active ports
- [ ] implement sending commands from interface to serial port
