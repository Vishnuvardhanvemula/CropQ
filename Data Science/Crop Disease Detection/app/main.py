import os
import json
from PIL import Image

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, GlobalAveragePooling2D, Dense, Dropout
import streamlit as st

working_dir = os.path.dirname(os.path.abspath(__file__))

# Define the model architecture
model = Sequential([
    Conv2D(16, kernel_size=(3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    
    Conv2D(32, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(32, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(32, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    GlobalAveragePooling2D(),  # Replaces Flatten
    
    Dense(32, activation='relu'),  # Reduced number of neurons
    Dropout(0.4),  # Dropout to reduce overfitting
    Dense(38, activation='softmax')  # 38 classes
])

# Load the weights
model_path = os.path.join(working_dir, 'model', 'keras_model_weights.weights.h5')

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model.load_weights(model_path)
# print(model.summary())

# Load the class names
class_indices = json.load(open(os.path.join(working_dir, 'class_indices.json')))

# Function to Load and Preprocess the Image using Pillow
def load_and_preprocess_image(image_path, target_size=(224, 224)):
    # Load the image
    img = Image.open(image_path)
    # Resize the image
    img = img.resize(target_size)
    # Convert the image to a numpy array
    img_array = np.array(img)
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    # Scale the image values to [0, 1]
    img_array = img_array.astype('float32') / 255.
    return img_array

# Function to Predict the Class of an Image
def predict_image_class(model, image_path, class_indices):
    preprocessed_img = load_and_preprocess_image(image_path)
    predictions = model.predict(preprocessed_img)
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    predicted_class_name = class_indices[str(predicted_class_index)]
    return predicted_class_name

# Streamlit App
st.title('Plant Disease Classifier')

uploaded_image = st.file_uploader("Upload an image...", type=["jpg", "jpeg", "png"])

if uploaded_image is not None:
    image = Image.open(uploaded_image)
    col1, col2 = st.columns(2)

    with col1:
        resized_img = image.resize((150, 150))
        st.image(resized_img)

    with col2:
        if st.button('Classify'):
            # Preprocess the uploaded image and predict the class
            prediction = predict_image_class(model, uploaded_image, class_indices)
            st.success(f'Prediction: {str(prediction)}')
            
            