const fs = require("fs");
const path = require('path');
const basename = path.basename(__filename);

const controllers = {};

// Get each event class
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file !== "Controller.js") && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const controller = require(path.join(__dirname, file));
    controllers[controller.name] = controller;
  });

// Register new events here
module.exports = controllers;