// controllers/workflowController.js
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();

// Identify crop (calls external API or dummy)
// Use multer middleware in your route: router.post('/identifyCrop', upload.single('image'), workflowController.identifyCrop);

exports.identifyCrop = async (req, res) => {
    try {
        const imageFile = req.file;
        if (!imageFile) return res.status(400).send("Image is required");

        // Build form-data with the uploaded image
        const formData = new FormData();
        formData.append("images", imageFile.buffer, {
            filename: imageFile.originalname,
            contentType: imageFile.mimetype,
        });
        formData.append("organs", "auto"); // optional, can be omitted for auto detection

        // Query parameters for Pl@ntNet
        const queryParams = new URLSearchParams({
            "api-key": process.env.PLANTNET_API_KEY,
            "include-related-images": "true",
            "nb-results": "3",
            "lang": "en",
            "no-reject": "false",
        });

        const response = await axios.post(
            `https://my-api.plantnet.org/v2/identify/all?${queryParams.toString()}`,
            formData,
            { headers: formData.getHeaders() }
        );

        // Clean response: extract top species and related images
        const cleanedResults = response.data.results.map((item) => ({
            scientificName: item.species.scientificName,
            commonNames: item.species.commonNames || [],
            score: item.score,
            relatedImages: item.relatedImages?.map((img) => img.url) || [],
        }));

        res.json({
            bestMatch: response.data.bestMatch,
            results: cleanedResults,
            version: response.data.version,
            remainingRequests: response.data.remainingIdentificationRequests,
        });
    } catch (error) {
        console.error(
            "Pl@ntNet API error:",
            error.response?.data || error.message
        );
        res
            .status(error.response?.status || 500)
            .send(error.response?.data?.message || "Error identifying crop");
    }
};

// Forecast market prices
exports.marketPriceForecasting = async (req, res) => {
    try {
        // Accept state and date from query params
        const state = req.query.state || "Karnataka";
        const date = req.query.date || "25-10-2023";

        if (!state || !date) {
            return res.status(400).json({
                success: false,
                error: "state and date query params required",
            });
        }

        // AGMARKNET state-level report URL
        const url = `https://agmarknet.gov.in/Price_Report/PR_StatewiseCommodityReport_Day.aspx?State=${encodeURIComponent(state)}&Date=${encodeURIComponent(date)}`;
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        const results = [];
        $("table tr").each((i, el) => {
            const cols = $(el).find("td");
            if (cols.length > 0) {
                results.push({
                    market: $(cols[0]).text().trim(),
                    commodity: $(cols[1]).text().trim(),
                    minPrice: $(cols[2]).text().trim(),
                    maxPrice: $(cols[3]).text().trim(),
                    modalPrice: $(cols[4]).text().trim(),
                });
            }
        });
        // Log the results for debugging
        console.log("Scraped results:", results);
        return res.json({
            success: true,
            state,
            date,
            prices: results,
        });
    } catch (error) {
        console.error("Error scraping AGMARKNET by location:", error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
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
        res.json({
            success: true,
            recommended_crop: response.data.recommended_crop
        });
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
        res.json({
            success: true,
            Fertilizer: response.data.Fertilizer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching fertilizer recommendation');
    }
};

// Plant disease prediction (calls external API )

exports.plantDiseasePrediction = async (req, res) => {
    try {
        const imageFile = req.file;

        // convert buffer to base64
        const base64Image = imageFile.buffer.toString("base64");

        // Crop.health API endpoint
        const url = "https://crop.kindwise.com/api/v1/identification";

        // request body (JSON)
        const requestBody = {
            images: [base64Image],
            similar_images: true,          // optional
            // datetime: "2025-09-21",     // optional
            // custom_id: 123               // optional
        };

        const response = await axios.post(url, requestBody, {
            headers: {
                "Content-Type": "application/json",
                "Api-Key": process.env.CROP_HEALTH_API_KEY,
            },
        });

        // forward the response as-is, or extract only diseases:
        const diseases = response.data.result?.disease?.suggestions || [];
        res.json({ diseases });

    } catch (error) {
        console.error("Crop.health API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch crop health prediction" });
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
