const db = require("../config/database.js");
const Shop = db.Shop;
const categoryController = require("./category.controller.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get Shop by ID
exports.get = (req, res) => {
    const id = req.params.id;

    Shop
        .findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Shop with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Shop with id=" + id });
        });
};

// Get Whishlist by User ID
exports.getAll = (req, res) => {
    Shop.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
};

// Create and Save a new Shop
exports.post = async (req, res) => {
    var encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const shop = new Shop({
        name: req.body.name,
        category: req.body.category,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        city: req.body.city,
        province: req.body.province,
        phone: req.body.phone,
        image: req.body.image,
        description: req.body.description,
        workingHours: req.body.workingHours,
        username: req.body.username,
        password: encryptedPassword,
        services: [],
        workers: []
    });

    shop
        .save(shop)
        .then(data => {
            var result = categoryController.addShoptoCategory(data.category, data._id);

            if (result) {
                res.send(data);
            } else {
                res.status(500).send({
                    message:
                        "Some error occurred while addin ShopId to Category."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Shop."
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Shop.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Shop with id=${id}. Maybe Shop was not found!`
                });
            } else {
                var result = categoryController.deleteShop(data.category, data._id);
                if (result) {
                    res.send({
                        message: "Shop was deleted and removed from Category successfully!"
                    });
                } else {
                    res.status(500).send({
                        message:
                            "Shop was deleted but some error occurred while deleting ShopId from Category."
                    });
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Shop with id=" + id
            });
        });
}

exports.addServicetoShop = (id, serviceId) => {
    var result = true;
    Shop.findByIdAndUpdate(id, {
        $push: { services: serviceId }
    }, { new: true })
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

// Add a service to a shop
exports.addService = (req, res) => {
    const id = req.params.id;
    const serviceId = req.body.serviceId;

    var result = this.addServicetoShop(id, serviceId);

    if (result) {
        res.send({
            message: "Service was added successfully!"
        });
    }
    else {
        res.status(500).send({
            message: "Could not add Service with id=" + serviceId
        });
    }
}

exports.addWorkertoShop = (id, workerId) => {
    var result = true;

    Shop.findByIdAndUpdate(id, {
        $push: { workers: workerId }
    }, { new: true })
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

// Add a worker to a shop
exports.addWorker = (req, res) => {
    const id = req.params.id;
    const workerId = req.body.workerId;

    var result = this.addWorkertoShop(id, workerId);
    if (result) {
        res.send({
            message: "Worker was added successfully!"
        });
    } else {
        res.status(500).send({
            message: "Could not add Worker with id=" + workerId
        });
    }
}

exports.removeServicefromShop = (id, serviceId) => {
    var result = true;

    Shop.findByIdAndUpdate(id, {
        $pull: { services: serviceId }
    }, { new: true })
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

// Remove a service from a shop
exports.removeService = (req, res) => {
    const id = req.params.id;
    const serviceId = req.body.serviceId;


    var result = this.removeServicefromShop(id, serviceId);

    if (result) {
        res.send({
            message: "Service was removed successfully!"
        });
    } else {
        res.status(500).send({
            message: "Could not remove Service with id=" + serviceId
        });
    }
}

exports.removeWorkerfromShop = (id, workerId) => {
    var result = true;

    Shop.findByIdAndUpdate(id, {
        $pull: { workers: workerId }
    }, { new: true })
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

// Remove a worker from a shop
exports.removeWorker = (req, res) => {
    const id = req.params.id;
    const workerId = req.body.workerId;

    var result = this.removeWorkerfromShop(id, workerId);

    if (result) {
        res.send({
            message: "Worker was removed successfully!"
        });
    }
    else {
        res.status(500).send({
            message: "Could not remove Worker with id=" + workerId
        });
    }
}

// Update a Shop by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Shop.
        findByIdAndUpdate
        (
            id,
            {
                name: req.body.name,
                category: req.body.category,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                city: req.body.city,
                province: req.body.province,
                phone: req.body.phone,
                image: req.body.image,
                description: req.body.description,
                workingHours: req.body.workingHours,
                username: req.body.username,
                password: req.body.password,
                services: req.body.services,
                workers: req.body.workers
            },
            { useFindAndModify: false }
        )
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Shop with id=${id}. Maybe Shop was not found!`
                });
            } else res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Shop with id=" + id
            });
        });
}