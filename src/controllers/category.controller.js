const db = require("../config/database.js");
const Category = db.Category;

exports.getAll = (req, res) => {
    Category.find()
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

exports.post = (req, res) => {
    const category = new Category({
        name: req.body.name,
    });

    category
        .save(category)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Category."
            });
        });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
                });
            } else {
                res.send({
                    message: "Category was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Category with id=" + id
            });
        });
}

exports.addShoptoCategory = (id, shopId) => {
    var result = true;
    Category.findByIdAndUpdate(id, { $push: { shops: shopId } }, { new: true })
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

exports.addShop = (req, res) => {
    const id = req.params.id;
    const shopId = req.body.shop

    var result = this.addShoptoCategory(id, shopId);

    if (result) {
        res.send(data);
    }
    else {
        res.status(500).send({
            message:
                "Some error occurred while addin ShopId to Category."
        });
    }
}

exports.getShops = (req, res) => {
    const id = req.params.id;

    Category
        .aggregate([
            { $match: { _id: db.mongoose.Types.ObjectId(id) },  },
            {
                $project: {
                    shops: 1
                }
            }
        ])
        .then(data => {
            var shopIds = data[0].shops;
            db.Shop.find({ _id: { $in: shopIds } })
                .then(data => {
                    res.send(data);
                }
                )
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving categories."
                    });
                }
                );
        }
        )
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while trying to find category."
            });
        }
        );

}

exports.deleteShop = (id, shopId) => {
    var result = true;
    Category.findByIdAndUpdate(id, { $pull: { shops: shopId } }, { new: true })
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