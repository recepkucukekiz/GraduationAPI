const db = require("../config/database.js");
const Service = db.Service;
const shopController = require("./shop.controller.js");
const workerController = require("./worker.controller.js");

// Get all Services
exports.getAll = (req, res) => {
    Service.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving services."
            });
        });
}

// Get Service by ID
exports.get = (req, res) => {
    const id = req.params.id;

    Service.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Service with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Service with id=" + id });
        });
}

// Get Services by Shop ID
exports.getByShop = (req, res) => {
    const id = req.params.id;

    Service
        .find({ shopId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Service with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Service with id=" + id });
        });
}

// Create Service
exports.post = (req, res) => {
    const service = new Service({
        name: req.body.name,
        price: req.body.price,
        duration: req.body.duration,
        shopId: req.body.shopId,
        workers: []
    });

    service
        .save(service)
        .then(data => {
            var result = shopController.addServicetoShop(req.body.shopId, data._id);
            if (result) {
                res.send(data);
            } else {
                res.status(500).send({
                    message:
                        "Service created but did not add to shop."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Service."
            });
        });
}

// Update a Service
exports.put = (req, res) => {
    const id = req.params.id;

    Service
        .findByIdAndUpdate
        (
            id, 
            {
                name: req.body.name,
                price: req.body.price,
                duration: req.body.duration,
                shopId: req.body.shopId,
                workers: req.body.workers
            }, 
            { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Service with id=${id}. Maybe Service was not found!`
                });
            } else res.send({ message: "Service was updated successfully." });
        }
        )
        .catch(err => {
            res.status(500).send({
                message: "Error updating Service with id=" + id
            });
        }
        );
}

// Delete a Service
exports.delete = (req, res) => {
    const id = req.params.id;

    Service.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Service with id=${id}. Maybe Service was not found!`
                });
            } else {
                res.send({
                    message: "Service was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Service with id=" + id
            });
        });
}

exports.addWorkertoService = (id, workerId) => {
    var result = true;
    Service.findByIdAndUpdate
        (
            id
            , { $push: { workers: workerId } }
            , { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                result = false;
            }
        }
        )
        .catch(err => {
            result = false;
        }
        );
    return result;
}

// Add a Worker to a Service
exports.addWorker = (req, res) => {
    const id = req.params.id;
    const workerId = req.body.workerId

    var result = this.addWorkertoService(id, workerId);
    if (result) {
        var nestedResult = workerController.addServicetoWorker(workerId, id);
        if (nestedResult) {
            res.send({ message: "Service was updated successfully." });
        } else {
            res.status(500).send({
                message: "Worker added to Service but Service not added to Worker."
            });
        }
    } else {
        res.status(500).send({
            message: "Error updating Service with id=" + id
        });
    }
}

// Remove a Worker from a Service
exports.removeWorker = (req, res) => {
    const id = req.params.id;
    const workerId = req.body.workerId

    Service.findByIdAndUpdate(id
        , { $pull: { workers: workerId } }
        , { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Service with id=${id}. Maybe Service was not found!`
                });
            } else res.send({ message: "Service was updated successfully." });
        }
        )
        .catch(err => {
            res.status(500).send({
                message: "Error updating Service with id=" + id
            });
        }
        );
}