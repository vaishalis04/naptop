const express = require('express');
const router = express.Router();
const TaulParchiController = require('../controllers/taulparchi.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/userId/:id',  TaulParchiController.getByUser);

router.get('/getsummary', TaulParchiController.getTaulParchiSummary);

router.get('/getwearhouseSummary', TaulParchiController.getWearhouseSummary);

router.get('/getWeightwearhouseSummary', TaulParchiController.getWearhouseWeightSummary);

router.get('/', verifyAccessToken, TaulParchiController.list);

router.get('/pos', TaulParchiController.list);

router.post('/', TaulParchiController.create);

router.get('/getWeightsummary', TaulParchiController.getWeightSummary);

router.get('/taulparchisAggregate', TaulParchiController.getTaulparchisAggregatedData);

router.get('/getdetails', TaulParchiController.getTaulParchiDetails);

router.put('/:id', TaulParchiController.update);

router.delete('/:id', TaulParchiController.delete);

router.get('/:id', TaulParchiController.get);

router.patch('/:id', TaulParchiController.patch);





module.exports = router;