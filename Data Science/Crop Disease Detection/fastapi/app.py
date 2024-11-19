import os
import numpy as np # type: ignore
import tensorflow as tf # type: ignore
from keras.models import Sequential # type: ignore
from keras.layers import Conv2D, MaxPooling2D, GlobalAveragePooling2D, Dense, Dropout # type: ignore
from fastapi import FastAPI, File, UploadFile, HTTPException # type: ignore
from fastapi.responses import HTMLResponse # type: ignore
from fastapi.templating import Jinja2Templates # type: ignore
from PIL import Image # type: ignore
import io
import json
from starlette.requests import Request # type: ignore
import logging

# Set the environment variable to disable oneDNN custom operations
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

app = FastAPI()

# Set up Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Get the working directory
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
    
    GlobalAveragePooling2D(),  
    
    Dense(32, activation='relu'),  
    Dropout(0.4),  
    Dense(38, activation='softmax')  
])

# Load the weights
model_path = os.path.join(working_dir, 'model', 'keras_model_weights.weights.h5')

if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model.load_weights(model_path)

# Load the class names
class_indices_path = os.path.join(working_dir, 'class_indices.json')
try:
    with open(class_indices_path, 'r') as f:
        class_indices = json.load(f)
except Exception as e:
    logging.error(f"Error loading class indices: {e}")
    raise

def preprocess_image(image):
    # Preprocess the image to the required format
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = image.astype('float16') / 255.  # Scale the image values to [0, 1]
    return image

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file part")

    if file.filename == '':
        raise HTTPException(status_code=400, detail="No selected file")

    try:
        image = Image.open(io.BytesIO(await file.read()))
        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_indices[str(predicted_class_index)]
        return {"predicted_class": predicted_class_name}
    except Exception as e:
        logging.error(f"Error processing prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn # type: ignore
    uvicorn.run(app, host="127.0.0.1", port=8000)