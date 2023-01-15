module.exports = app => {
    const workerController = require("../controllers/worker.controller.js");

    var router = require("express").Router();

    router.get("/", workerController.getAll); // get all workers
    router.get("/:id", workerController.get); // get a worker
    router.get("/getByShop/:id", workerController.getByShop); // get all workers by shop id
    router.post("/", workerController.post); // create a new worker
    router.put("/:id", workerController.put); // update a worker
    router.delete("/:id", workerController.delete); // delete a worker
    router.post("/:id", workerController.addService); // add a service to a worker
    router.delete("/:id", workerController.removeService); // remove a service from a worker

    app.use("/api/worker", router);
}