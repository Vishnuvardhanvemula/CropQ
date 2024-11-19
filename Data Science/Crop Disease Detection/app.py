import os
import numpy as np
import tensorflow as tf
from keras.models import load_model
from flask import Flask, request, jsonify, render_template
from PIL import Image
import io
import json
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
model_path = os.path.join(working_dir, 'app', 'model', 'keras_model_weights.weights.h5')

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model.load_weights(model_path)

# Load the class names
class_indices_path = os.path.join(working_dir, 'app', 'class_indices.json')
with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

def preprocess_image(image):
    # Preprocess the image to the required format
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    return image

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return render_template('index.html', error='No file part')

    file = request.files['file']
    if file.filename == '':
        return render_template('index.html', error='No selected file')

    try:
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_indices[str(predicted_class_index)]
        return render_template('index.html', prediction=predicted_class_name)
    except Exception as e:
        return render_template('index.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)