const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const multer = require('multer');
const upload = multer();

// Use multer middleware for file upload
router.post('/identifyCrop', upload.single('images'), workflowController.identifyCrop);
router.get('/marketPriceForecasting', workflowController.marketPriceForecasting);
router.post('/croprecommendation', workflowController.cropRecommendation);
router.post('/fertilizerrecommendation', workflowController.fertilizerRecommendation);
router.post('/plantdiseaseprediction', upload.single('file'), workflowController.plantDiseasePrediction);
router.get('/weatherreport', workflowController.getWeatherReport);
router.post('/chatbot', workflowController.chatBot);

module.exports = router;
