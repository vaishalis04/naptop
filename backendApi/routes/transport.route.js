const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transport.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/',  transportController.list);

router.post('/', transportController.create);

router.put('/:id', transportController.update);

router.delete('/:id', transportController.delete);

router.get('/:id', transportController.get);



module.exports = router;
