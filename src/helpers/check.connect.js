"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connect.length;
  console.log("Number of connections: ", numConnection);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connect.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    const maxConnections = numCores * 5;
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
