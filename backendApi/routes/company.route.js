
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/',  companyController.list);

router.post('/', companyController.create);

router.put('/:id', companyController.update);

router.delete('/:id', companyController.delete);

router.get('/:id', companyController.get);



module.exports = router;