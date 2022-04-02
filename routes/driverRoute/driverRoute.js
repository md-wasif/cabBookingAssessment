const express = require("express");
const driverService = require("../../controllers/driverController");

const router = express.Router();
router.post('/register', driverService.register);
router.get('/addAddress', driverService.addAddress);
router.get('/editAddress', driverService.editAddress);


module.exports = router;