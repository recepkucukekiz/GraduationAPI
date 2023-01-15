module.exports = app => {
    const categoryController = require("../controllers/category.controller.js");
  
    var router = require("express").Router();

    router.get("/", categoryController.getAll); // get all categories
    router.post("/", categoryController.post); // create a new category
    router.delete("/:id", categoryController.delete); // delete a category
    router.post("/:id", categoryController.addShop); // add a shop to a category
    router.get("/getshops/:id", categoryController.getShops); // get all shops in a category

    app.use("/api/category", router);
  };