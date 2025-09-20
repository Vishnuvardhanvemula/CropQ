// controllers/workflowController.js
const axios = require('axios');
const FormData = require('form-data');

// Identify crop (calls external API or dummy)
exports.identifyCrop = async (req, res) => {
    try {
        const imageFile = req.file; // make sure you use multer middleware for file upload
        if (!imageFile) {
            return res.status(400).send('Image is required');
        }

        const formData = new FormData();
        formData.append('image', imageFile.buffer, imageFile.originalname);

        // Example: call external API
        const response = await axios.post(
            `${process.env.API_URL}/CropQ/workflow/identifyCrop`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'apiKey': process.env.API_KEY,
                    ...formData.getHeaders(),
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error identifying crop');
    }
};

// Forecast market prices
exports.getCropPrices = async (req, res) => {
    try {
        res.json({
            success: true,
            prices: [
                { crop: 'Wheat', price: 2500 },
                { crop: 'Rice', price: 3000 },
            ],
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Crop recommendation
exports.cropRecommendation = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload) {
            return res.status(400).send('Payload is required');
        }

        const response = await axios.post(
            'https://agriculture-ai-ef4b0b78e08a.herokuapp.com/recommend',
            payload,
            { headers: { 'Content-type': 'application/json' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching crop recommendation');
    }
};

// Fertilizer recommendation
exports.fertilizerRecommendation = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload) {
            return res.status(400).send('Payload is required');
        }

        const response = await axios.post(
            'https://agriculture-ai-ef4b0b78e08a.herokuapp.com/fertilizer_recommendation',
            payload,
            { headers: { 'Content-type': 'application/json' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching fertilizer recommendation');
    }
};

// Plant disease prediction
exports.plantDiseasePrediction = async (req, res) => {
    try {
        const imageFile = req.files?.file;
        if (!imageFile) {
            return res.status(400).send('File is required');
        }

        const formData = new FormData();
        formData.append('file', imageFile.data);

        const response = await axios.post(
            'https://agriculture-ai-ef4b0b78e08a.herokuapp.com/predict',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error predicting plant disease');
    }
};

// Weather report
exports.getWeatherReport = async (req, res) => {
    try {
        const { cityName } = req.query;
        if (!cityName) {
            return res.status(400).send('cityName is required');
        }

        const response = await axios.get(
            'http://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    q: cityName,
                    appid: process.env.WEATHER_API_KEY,
                    units: 'metric',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
};

// Chatbot
exports.chatBot = async (req, res) => {
    try {
        const { message } = req.body;
        res.json({
            success: true,
            reply: `You said: "${message}". This is a chatbot response.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
