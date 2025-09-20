
// Unified API utility for CropQ frontend
const BASE_URL = 'http://localhost:3000/workflow'; // Adjust if your backend is served elsewhere

export const cropQAPIs = {
  // Crop Identification (image upload)
  cropIdentification: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await fetch(`${BASE_URL}/identifyCrop`, {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  // Market Price Forecasting
  marketPriceForecasting: async () => {
    const response = await fetch(`${BASE_URL}/marketpriceforecasting`);
    return response;
  },

  // Crop Recommendation
  cropRecommendation: async (payload) => {
    const response = await fetch(`${BASE_URL}/croprecommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  },

  // Fertilizer Recommendation
  fertilizerRecommendation: async (payload) => {
    const response = await fetch(`${BASE_URL}/fertilizerrecommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  },

  // Plant Disease Prediction (image upload)
  plantDiseasePrediction: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await fetch(`${BASE_URL}/plantdiseaseprediction`, {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  // Weather Report (current or forecast)
  weatherReport: async (cityName, type = 'current') => {
    if (type === 'current') {
      const response = await fetch(`${BASE_URL}/weatherreport?cityName=${encodeURIComponent(cityName)}`);
      return response.json();
    } else if (type === 'forecast') {
      // If you have a forecast endpoint, use it. Otherwise, fallback or mock.
      // Example: `${BASE_URL}/weatherforecast?cityName=...`
      return { list: [] }; // Placeholder
    }
  },

  // Chatbot
  chatBot: async (message) => {
    const response = await fetch(`${BASE_URL}/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response;
  },
};
