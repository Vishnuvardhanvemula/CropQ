import axios from 'axios';
// Unified API utility for CropQ frontend
const BASE_URL = 'http://localhost:3000/workflow'; 

export const cropQAPIs = {
  // Crop Identification (image upload)
  cropIdentification: async (imageFile) => {
    const formData = new FormData();
    formData.append('images', imageFile);
    const response = await fetch(`${BASE_URL}/identifyCrop`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log("Crop Identification API response :", data);
    return data;
  },

  // Market Price Forecasting
  marketPriceForecasting: async () => {
    const response = await fetch(`${BASE_URL}/marketpriceforecasting`);
    return response;
  },

  // Crop Recommendation
   cropRecommendation: async (payload) => {
    const res = await axios.post(`${BASE_URL}/croprecommendation`, payload);
    return res.data; 
  },

  // Fertilizer Recommendation
  fertilizerRecommendation: async (payload) => {
    const res = await axios.post(`${BASE_URL}/fertilizerrecommendation`, payload);
    return res.data;  
  },

  // Plant Disease Prediction (image upload)
  plantDiseasePrediction: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await fetch(`${BASE_URL}/plantdiseaseprediction`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data;
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

  // Testimonials (mocked for now)
  getTestimonials: async () => {
    // Replace with actual API call if available
    return [
      { name: "John Doe", feedback: "CropQ helped me detect diseases early and save my crops!" },
      { name: "Jane Smith", feedback: "The recommendations are spot on and easy to follow." }
    ];
  },
};
