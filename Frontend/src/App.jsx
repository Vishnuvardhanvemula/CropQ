import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, Suspense, lazy } from "react";
import { ToastContainerStyled } from "./Utils/Toasts";
import { HashRouter as Router, Routes, Route} from 'react-router-dom';

// Lazy load components
const Loading = lazy(() => import("./Utils/Loading"));
const Navbar = lazy(() => import("./Components/Navbar"));
const Footer = lazy(() => import("./Components/Footer"));
const Chatbot = lazy(() => import("./Components/Chatbot"));
const SiteMap = lazy(() => import("./Components/Pages/SiteMap"));
const Contact = lazy(() => import("./Components/Pages/Contact"));
const Workflow = lazy(() => import("./Components/Pages/Workflow"));
const ScrollHandler = lazy(() => import("./Components/ScrollHandler"));
const Developers = lazy(() => import("./Components/Pages/Developers"));
const HeroSection = lazy(() => import("./Components/Pages/HeroSection"));
const FeatureSection = lazy(() => import("./Components/Pages/FeatureSection"));
const WeatherReport = lazy(() => import("./Components/WorkFlows/WeatherReport"));
const CropIdentification = lazy(() => import("./Components/WorkFlows/CropIdentification"));
const CropRecommendation = lazy(() => import("./Components/WorkFlows/CropRecommendation"));
const PlantDiseasePrediction = lazy(() => import("./Components/WorkFlows/PlantDiseasePrediction"));
const MarketPriceForecasting = lazy(() => import("./Components/WorkFlows/MarketPriceForecasting"));
const FertilizerRecommendation = lazy(() => import("./Components/WorkFlows/FertilizerRecommendation"));

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,       
        v7_relativeSplatPath: true,      
      }}
    >
      <Suspense fallback={<Loading />}>
        <ScrollHandler />
        <Navbar />
        <ToastContainerStyled />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/features" element={<FeatureSection />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/cropidentification" element={<CropIdentification />} />
          <Route path="/croprecommendation" element={<CropRecommendation />} />
          <Route path="/fertilizerrecommendation" element={<FertilizerRecommendation />} />
          <Route path="/plantdiseaseprediction" element={<PlantDiseasePrediction />} />
          <Route path="/weatherreport" element={<WeatherReport />} />
          <Route path="/marketpriceforecasting" element={<MarketPriceForecasting />} />
        </Routes>
        <Chatbot />
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
