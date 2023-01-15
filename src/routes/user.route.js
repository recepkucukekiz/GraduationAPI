module.exports = (app) => {
    const userController = require('../controllers/user.controller.js');
    const auth = require('../config/auth.js');

    var router = require("express").Router();

    router.post("/login", userController.login); // login a user
    router.post("/register", userController.register); // register a user
    router.get("/test", auth, userController.test); // test auth (for testing only)

    app.use("/api/user", router);
}