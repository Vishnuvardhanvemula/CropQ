// Example constants for CropQ
export const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Workflow", href: "/workflow" }
];

// Features array for navigation and display
export const featuresList = [
    "Disease Detection",
    "Crop Recommendation",
    "Fertilizer Advice"
];

// Features count
export const featuresCount = featuresList.length;
import feature1 from "../Assets/Features/Feature1.webp";
import feature2 from "../Assets/Features/Feature2.webp";
import feature3 from "../Assets/Features/Feature3.webp";
import workflow1 from "../Assets/Workflow/Workflow1.webp";
import workflow2 from "../Assets/Workflow/Workflow2.webp";
import workflow3 from "../Assets/Workflow/Workflow3.webp";
import workflow4 from "../Assets/Workflow/Workflow4.webp";
import workflow5 from "../Assets/Workflow/Workflow5.webp";
import workflow6 from "../Assets/Workflow/Workflow6.webp";
import { Camera, CloudUpload, PcCase } from "lucide-react";

// Features for FeatureSection (Home)
export const features = [
    {
        image: feature1,
        title: "Disease Detection",
        description: "Detect plant diseases using AI-powered image analysis."
    },
    {
        image: feature2,
        title: "Crop Recommendation",
        description: "Get crop recommendations based on soil and climate data."
    },
    {
        image: feature3,
        title: "Fertilizer Advice",
        description: "Receive tailored fertilizer advice for optimal growth."
    }
];

// Features for Workflow page
export const workflowFeatures = [
    {
        image: workflow1,
        icon: Camera,
        link: "/CropIdentification",
        text: "Crop Identification",
        instructions: [
            "Analyze crop data for yield estimation.",
            "Optimize resources for better output.",
            "Make informed decisions for your farm."
        ]

    },
    {
        image: workflow2,
        icon: CloudUpload,
        link: "/CropRecommendation",
        text: "Crop Recommendation",
        instructions: [
            "Enter soil and climate details.",
            "AI suggests best crops for your region.",
            "Plan your farming with confidence."
        ]
    },
    {
        image: workflow3,
        icon: PcCase,
        link: "/FertilizerRecommendation",
        text: "Fertilizer Advice",
        instructions: [
            "Input crop and soil data.",
            "Get personalized fertilizer recommendations.",
            "Boost your yield with smart advice."
        ]
    },
    {

        image: workflow4,
        icon: CloudUpload,
        link: "/PlantDiseasePrediction",
        text: "Disease Detection",
        instructions: [
            "Upload a clear image of your crop.",
            "Let AI analyze for possible diseases.",
            "Get instant diagnosis and advice."
        ]
    },
    {

        image: workflow5,
        icon: Camera,
        link: "/WeatherReport",
        text: "Weather Forecast",
        instructions: [
            "Get real-time weather updates.",
            "Plan your farming activities accordingly.",
            "Minimize risks with accurate forecasts."
        ]
    },
    {
        image: workflow6,
        icon: PcCase,
        link: "/MarketPriceForecasting",
        text: "Market Analysis",
        instructions: [
            "Access market trends and prices.",
            "Maximize profits with smart selling.",
            "Stay ahead with AI-driven insights."
        ]
    }
];
// ...existing code...
// Developers list for Contact page
export const developers = [
    {
        name: "Alice Smith",
        role: "Frontend Developer",
        linkedin: "https://linkedin.com/in/alicesmith",
        github: "https://github.com/alicesmith",
        instagram: "https://instagram.com/alicesmith"
    },
    {
        name: "Bob Johnson",
        role: "Backend Developer",
        linkedin: "https://linkedin.com/in/bobjohnson",
        github: "https://github.com/bobjohnson",
        instagram: "https://instagram.com/bobjohnson"
    }
];

// Professions for contact form dropdown
export const contactProfessions = [
    "Farmer",
    "Agronomist",
    "Student",
    "Researcher",
    "Other"
];

// Subjects for contact form dropdown
export const contactSubjects = [
    "General Inquiry",
    "Technical Support",
    "Feedback",
    "Partnership",
    "Other"
];
