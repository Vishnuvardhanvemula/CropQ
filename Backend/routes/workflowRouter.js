const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

router.post('/identifyCrop', workflowController.identifyCrop);
router.get('/marketpriceforecasting', workflowController.getCropPrices);
router.post('/croprecommendation', workflowController.cropRecommendation);
router.post('/fertilizerrecommendation', workflowController.fertilizerRecommendation);
router.post('/plantdiseaseprediction', workflowController.plantDiseasePrediction);
router.get('/weatherreport', workflowController.getWeatherReport);
router.post('/chatbot', workflowController.chatBot);

module.exports = router;
