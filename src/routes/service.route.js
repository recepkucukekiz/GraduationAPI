module.exports = app => {
    const serviceController = require("../controllers/service.controller.js");
  
    var router = require("express").Router();
 
    router.get("/", serviceController.getAll); // get all services
    router.get("/:id", serviceController.get); // get a service
    router.get("/getByShop/:id", serviceController.getByShop); // get all services by shop id
    router.post("/", serviceController.post); // create a new service
    router.put("/:id", serviceController.put); // update a service
    router.delete("/:id", serviceController.delete); // delete a service
    router.post("/:id", serviceController.addWorker); // add a service to a worker
    router.delete("/:id", serviceController.removeWorker); // remove a service from a worker
 
    app.use("/api/service", router);
  }