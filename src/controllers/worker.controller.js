const db = require("../config/database.js");
const Worker = db.Worker;
const shopController = require("./shop.controller.js");
const serviceController = require("./service.controller.js");

// Get all Workers
exports.getAll = (req, res) => {
    Worker.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving workers."
            });
        });
}

// Get Worker by ID
exports.get = (req, res) => {
    const id = req.params.id;

    Worker
        .findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Worker with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Worker with id=" + id });
        });
}

// Get Workers by Shop ID
exports.getByShop = (req, res) => {
    const id = req.params.id;

    Worker
        .find({ shopId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Worker with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Worker with id=" + id });
        });
}

// Create Worker
exports.post = (req, res) => {
    const worker = new Worker({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        shopId: req.body.shopId,
        services: req.body.services
    });

    worker
        .save(worker)
        .then(data => {
            var result = shopController.addWorkertoShop(req.body.shopId, data._id);
            if (result) {
                res.send(data);
            }
            else {
                res.status(500).send({
                    message:
                        "Worker created but did not add to shop."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Worker."
            });
        });
}

// Update Worker by ID
exports.put = (req, res) => {
    const id = req.params.id;

    Worker
        .findByIdAndUpdate
        (
            id,
            {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                shopId: req.body.shopId,
                services: req.body.services
            },
            { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Worker with id=${id}. Maybe Worker was not found!`
                });
            } else res.send({ message: "Worker was updated successfully." });
        }
        )
        .catch(err => {
            res.status(500).send({
                message: "Error updating Worker with id=" + id
            });
        }
        );
}

// Delete Worker by ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Worker
        .findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Worker with id=${id}. Maybe Worker was not found!`
                });
            } else {
                var result = shopController.removeWorkerfromShop(data.shopId, id);
                if (!result) {
                    res.status(500).send({
                        message: "Worker deleted but did not remove from shop."
                    });
                } else {
                    var nestedResult = serviceController.removeWorkerfromServices(data.services, id);
                    if (!nestedResult) {
                        res.status(500).send({
                            message: "Worker deleted but did not remove from services."
                        });
                    }
                }
                res.send({
                    message: "Worker was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Worker with id=" + id
            });
        });
}

exports.addServicetoWorker = (id, serviceId) => {
    var result = true;
    Worker
        .findByIdAndUpdate
        (
            id,
            { $push: { services: serviceId } },
            { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                result = false;
            }
        })
        .catch(err => {
            result = false;
        });
    return result;
}

// Add Service to Worker
exports.addService = (req, res) => {
    const workerId = req.params.id;
    const serviceId = req.body.serviceId;

    var result = this.addServicetoWorker(workerId, serviceId);
    if (result) {
        var nestedResult = serviceController.addWorkertoService(serviceId, workerId);
        if (nestedResult) {
            res.send({ message: "Worker was updated successfully." });
        } else {
            res.status(500).send({
                message: "Service added to Worker but Worker not added to Service."
            });
        }
    } else {
        res.status(500).send({
            message: "Error updating Worker with id=" + workerId
        });
    }
}

// Remove Service from Worker
exports.removeService = (req, res) => {
    const workerId = req.params.id;
    const serviceId = req.params.serviceId;

    Worker
        .findByIdAndUpdate
        (
            workerId,
            { $pull: { services: serviceId } },
            { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Worker with id=${workerId}. Maybe Worker was not found!`
                });
            } else res.send({ message: "Worker was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Worker with id=" + workerId
            });
        });
}