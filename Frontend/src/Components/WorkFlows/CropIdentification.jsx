import React, { useState } from 'react';
import Loading from '../../Utils/Loading';
import { cropQAPIs } from '../../Utils/cropQAPIs';
import { notifyWarn, notifyError, notifySuccess } from "../../Utils/Toasts";

const CropIdentification = () => {
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
      const response = await cropQAPIs.cropIdentification(selectedImage);
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
        Crop Identific
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          ation
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Upload an Image, Get Instant Info: Identify crops by uploading a photo, with AI analyzing <br />
        and providing insights into plant species and care needs.
      </p>

      <div className="mt-10 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center justify-center w-full md:w-8/12 lg:w-6/12 p-10 bg-gray-200 dark:bg-neutral-900 rounded-lg text-center" data-aos="zoom-in" data-aos-delay="300">
          <label 
            htmlFor="imageUpload" 
            className="block text-neutral-500 mb-2"
          >
            Upload Image (JPEG, JPG, PNG, JFIF only)
          </label>

          <input
            type="file"
            id="imageUpload"
            accept="image/jpeg, image/jpg, image/png, image/jfif"
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
              <div className="w-full sm:w-5/12 md:w-6/12 lg:w-7/12 p-6" data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-20 tracking-wide">
                  Uploaded Image :{" "}
                  <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text capitalize">
                    {selectedImage.name}
                  </span>
                </h2>
                <p className="text-neutral-600 dark:text-neutral-500 font-normal mt-5">
                  Discover our top 2 predictions just below with scientific names, common names, matched scores, related images, and more fascinating insights. Scroll down for a closer look!
                </p>
              </div>
              <div className="w-full sm:w-5/12 md:w-5/12 lg:w-5/12 p-6" data-aos="zoom-in" data-aos-delay="300">
                <img
                  src={uploadedImage}
                  alt="Uploaded Crop"
                  loading="lazy"
                  className="w-full sm:w-80 md:w-96 lg:w-2/2 h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-20 tracking-wide" data-aos="fade-up" data-aos-delay="300">
              Top Matched Predic
              <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
              tion Insights
              </span>
            </h2>

            {apiResponse.results.slice(0, 2).map((result, index) => (
              <div key={index} className="mt-5 flex flex-wrap items-center" data-aos="fade-up" data-aos-delay={300 + index * 100} >
                <div className="flex flex-wrap w-full p-6">
                  <div className="w-full sm:w-full md:w-6/12 lg:w-6/12 text-left">
                    <h3 className="font-normal">
                      Scientific Name :  
                      <span className="text-custom-green"> {result.species.scientificName}</span>
                    </h3>
                    <p className="font-normal">
                      Matched Score :
                      <span className="text-custom-green"> {Math.round(result.score * 100)}%</span>
                    </p>
                  </div>

                  <div className="w-full sm:w-full md:w-6/12 lg:w-6/12 text-left">
                    <div className="flex">
                      <p className="font-normal">Common Names : </p> &nbsp;
                      <div className="text-custom-green"> 
                        {result.species.commonNames.map((name, idx) => (
                          <p key={idx} className="block">{name}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-full md:w-full lg:w-full p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {result.images.slice(0, 3).map((image, idx) => (
                      <img
                        key={idx}
                        src={image.url.s}
                        alt={`Related image ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-40 sm:h-40 md:h-50 lg:h-60 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropIdentification;
