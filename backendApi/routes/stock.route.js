const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require("../Helpers/jwt_helper");
const stockController = require('../controllers/stock.controller');

router.get('/', stockController.list);

router.get(
    '/warehouse-stock-crop-wise',
    stockController.warehouseStockCropWise
);

router.get(
    '/warehouse-stock-crop-wise/:warehouseId',
    stockController.getCropWiseWarehouseWisePendingBagConversionCount
);

router.post('/', stockController.create);

router.put('/:id', stockController.update);

router.delete('/:id', stockController.delete);

router.get('/:id', stockController.get);

module.exports = router;
