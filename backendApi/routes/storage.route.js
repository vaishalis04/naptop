const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/',  storageController.list);

router.post('/', storageController.create);

router.put('/:id', storageController.update);

router.delete('/:id', storageController.delete);

router.get('/:id', storageController.get);



module.exports = router;
