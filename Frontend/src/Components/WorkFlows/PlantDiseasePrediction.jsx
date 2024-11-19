import React, { useState } from 'react';
import Loading from '../../Utils/Loading';
import { cropQAPIs } from '../../Utils/cropQAPIs';
import { notifyWarn, notifyError, notifySuccess } from "../../Utils/Toasts";

const PlantDiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadedImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      notifyWarn("Please upload an image before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await cropQAPIs.plantDiseasePrediction(selectedImage);
      if (response.status === 200) {
        setApiResponse(response.data); 
        setUploadedImage(URL.createObjectURL(selectedImage));
        notifySuccess("Image uploaded successfully and Scroll Down to see our predictions");
      }
    } catch (error) {
      notifyError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Plant Disease Pre
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          diction
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Detects early signs of plant diseases from images, offering insights to <br />
        prevent or treat potential issues promptly.
      </p>

      <div className="mt-10 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center justify-center w-full md:w-8/12 lg:w-6/12 p-10 bg-gray-200 dark:bg-neutral-900 rounded-lg text-center" data-aos="zoom-in" data-aos-delay="300">
          <label 
            htmlFor="imageUpload" 
            className="block text-neutral-500 mb-2"
          >
            Upload Image (JPEG, JPG, PNG, TIFF, WEBP only)
          </label>

          <input
            type="file"
            id="imageUpload"
            accept="image/jpeg, image/jpg, image/png, image/jfif, image/tiff, image/webp"
            onChange={handleImageUpload}
            className="bg-white dark:bg-neutral-800 p-4 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer w-full sm:w-10/12 md:w-8/12 lg:w-8/12"
          />
          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            className={`py-3 px-6 mt-10 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md ${!selectedImage || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </div>

        {loading && <Loading />}

        {uploadedImage && apiResponse && (
          <div>
            <div className="flex flex-wrap mt-0 sm:mt-0 md:mt-15 lg:mt-20">
              <div className="w-full sm:w-5/12 md:w-6/12 lg:w-7/12" data-aos="fade-up" data-aos-delay="300">
                <p className="text-neutral-600 dark:text-neutral-500 font-normal mt-5">
                  Uploaded Image : &nbsp;
                  <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                    {selectedImage.name}
                  </span>
                  <br />
                </p>
                <p className="text-neutral-600 dark:text-neutral-500 font-normal mt-5">
                  Predicted Disease : &nbsp;
                  <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text capitalize">
                    {apiResponse.prediction.replace(/_+/g, ' ')}
                  </span>
                </p>
              </div>
              <div className="w-full sm:w-5/12 md:w-5/12 lg:w-5/12 p-6" data-aos="zoom-in" data-aos-delay="300">
                <img
                  src={uploadedImage}
                  alt="Uploaded Crop"
                  loading="lazy"
                  className="w-full sm:w-60 md:w-96 lg:w-2/2 h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDiseasePrediction;
