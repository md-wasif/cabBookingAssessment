const express = require("express");
const userService = require("../../controllers/userController");

const router = express.Router();
router.post('/register', userService.register);
router.post('/addAddress', userService.addAddress);
router.get('/getdriverList', userService.getdriverList);


module.exports = router;