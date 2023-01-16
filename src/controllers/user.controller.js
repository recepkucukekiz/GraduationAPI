const db = require("../config/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Shop = db.Shop;
require("dotenv").config();

// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body

    var user = await Shop.findOne({
        username: username
    })

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { user_id: user._id.toString() },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user.token = token;

        res.status(200).send({
            status:"OK",
            id: user.id,
            username: user.username,
            shopId: user._id,
            name: user.name,
            token: user.token
        });
    } else {
        res.status(401).send({ status: "FAIL", message: "Invalid username or password" });
    }

};

// Register a user
exports.register = async (req, res) => {
    const { username, password, name } = req.body

    var encryptedPassword = await bcrypt.hash(password, 10);

    Shop
        .create({
            username: username,
            password: encryptedPassword,
            name: name,
        })
        .then(shop => {

            const token = jwt.sign(
                { user_id: shop._id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            shop.token = token;

            res.status(200).send({
                id: shop.id,
                username: shop.username,
                name: shop.name,
                token: shop.token
            });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        }
        );
};

// Test auth (for testing only)
exports.test = async (req, res) => {
    res.status(200).send({ message: "Auth OK" });
}