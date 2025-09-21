import Modal from '../../Utils/Modal';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Loading from '../../Utils/Loading';
import { cropQAPIs } from '../../Utils/cropQAPIs';
import { notifySuccess, notifyError } from "../../Utils/Toasts";

const CropRecommendation = () => {
  const [recommendedCrop, setRecommendedCrop] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      ph: parseFloat(formData.ph),
      rainfall: parseFloat(formData.rainfall)
    };

    try {
      const response = await cropQAPIs.cropRecommendation(payload);

      setLoading(false);

      if (response.success) {
        setRecommendedCrop(response.recommended_crop);
        setIsModalOpen(true);
        notifySuccess('Crop Recommendation Successfully.');

        setFormData({
          N: '',
          P: '',
          K: '',
          temperature: '',
          humidity: '',
          ph: '',
          rainfall: ''
        });
      } else {
        notifyError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      notifyError('An error occurred. Please try again later.');
    }

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Crop Recommend
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          ation
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Suggests the best crops for your region based on soil, weather, and <br />
        environmental conditions to maximize yield.
      </p>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Click here for <Link to="/weatherreport" className="text-custom-green">Weather Report</Link>
      </p>

      <div className="w-full md:w-10/12 lg:w-8/12 mx-auto p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-lg shadow-lg mt-10" data-aos="zoom-in" data-aos-delay="300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="N" className="block font-medium text-gray-700 dark:text-neutral-300">Nitrogen (N)</label>
          <input
            type="number"
            id="N"
            name="N"
            min="0"
            value={formData.N}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter nitrogen value"
          />

          <label htmlFor="P" className="block font-medium text-gray-700 dark:text-neutral-300">Phosphorus (P)</label>
          <input
            type="number"
            id="P"
            min="0"
            name="P"
            value={formData.P}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter phosphorus value"
          />

          <label htmlFor="K" className="block font-medium text-gray-700 dark:text-neutral-300">Potassium (K)</label>
          <input
            type="number"
            id="K"
            min="0"
            name="K"
            value={formData.K}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter potassium value"
          />

          <label htmlFor="temperature" className="block font-medium text-gray-700 dark:text-neutral-300">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter temperature"
          />

          <label htmlFor="humidity" className="block font-medium text-gray-700 dark:text-neutral-300">Humidity (%)</label>
          <input
            type="number"
            id="humidity"
            min="0"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter humidity percentage"
          />

          <label htmlFor="ph" className="block font-medium text-gray-700 dark:text-neutral-300">Soil pH</label>
          <input
            type="number"
            step="0.1"
            id="ph"
            min="0"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter soil pH"
          />

          <label htmlFor="rainfall" className="block font-medium text-gray-700 dark:text-neutral-300">Rainfall (mm)</label>
          <input
            type="number"
            id="rainfall"
            min="0"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter rainfall"
          />

          <div className="text-center">
            <button
              type="submit"
              className="py-3 px-6 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md"
            >
              {loading ? 'Submiting' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Recommended Crop"
        value={recommendedCrop}
      />
    </div>
  );
};

export default CropRecommendation;
