const dbConfig = require("./db.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.Category = require("../models/category.model")(mongoose);
db.Shop = require("../models/shop.model")(mongoose);
db.Service = require("../models/service.model")(mongoose);
db.Worker = require("../models/worker.model")(mongoose);

module.exports = db;