const express = require('express');
const router = express.Router();
const TruckLoadingController = require('../controllers/truckLoading.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/',  TruckLoadingController.list);

router.post('/', TruckLoadingController.create);

router.put('/:id', TruckLoadingController.update);

router.delete('/:id', TruckLoadingController.delete);

router.get('/:id', TruckLoadingController.get);

router.get('/truck-loading-details',  TruckLoadingController.getTruckLoadingAggregatedData);

router.get('/getDetails',  TruckLoadingController.getTruckLoadingDetails);



module.exports = router;