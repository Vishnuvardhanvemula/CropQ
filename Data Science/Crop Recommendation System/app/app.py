from flask import Flask, request, jsonify, render_template
import os
import pickle

import mlflow
import mlflow.sklearn

# Initialize Flask app
app = Flask(__name__)

# Correct the directory path if necessary
# model_dir_path = r"C:\Users\tarak\OneDrive\Documents\AGRI APP\Crop Recommendation System\app"
# model_path = os.path.join(model_dir_path, 'DecisionTree.pkl')

# model_path = r"C:\Users\tarak\OneDrive\Documents\AGRI APP\Crop Recommendation System\app\DecisionTree.pkl"

model_path = os.path.join('DecisionTree.pkl')
 
# Check if the file exists
# if not os.path.exists(model_path):
#     raise FileNotFoundError(f"Model file not found: {model_path}")

# Load the pre-trained model
with open(model_path, 'rb') as model_file:
    load_model = pickle.load(model_file)

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Crop recommendation route
@app.route('/recommend', methods=['POST'])
def recommend_crop():
    # try:
        # Extract the nested data dictionary
    data = request.json.get('data')
    
    # Ensure data is not None
    if data is None:
        return jsonify({'error': 'Invalid input format'}), 400
    
    # Extract features from the nested data dictionary
    features = {
        'N': data.get('N'),
        'P': data.get('P'),
        'K': data.get('K'),
        'temperature': data.get('temperature'),
        'humidity': data.get('humidity'),
        'ph': data.get('ph'),
        'rainfall': data.get('rainfall')
    }
    
    # Convert dictionary values to a list for prediction
    feature_values = list(features.values())
    
    # Predict the recommended crop using the loaded model
    recommended_crop = load_model.predict([feature_values])[0]
    
    return jsonify({'recommended_crop': recommended_crop})
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')