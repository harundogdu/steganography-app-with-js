const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController.js');

router
    .post('/encrypt', apiController.encrypt)
    .post('/decrypt', apiController.decrypt)

module.exports = router;