module.exports = app => {
    const shopController = require("../controllers/shop.controller.js");
  
    var router = require("express").Router();

    router.get("/", shopController.getAll); // get all shops
    router.get("/:id", shopController.get); // get a shop by id
    router.post("/", shopController.post); // create a new shop
    router.delete("/:id", shopController.delete); // delete a shop
    
    app.use("/api/shop", router);
  };