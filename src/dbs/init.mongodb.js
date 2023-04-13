"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const {
  db: { host, name, port },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(connectString, "connect String");

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Database connection successful", countConnect());
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
