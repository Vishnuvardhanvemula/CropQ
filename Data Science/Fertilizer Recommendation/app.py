# Flask app
from flask import Flask, request, jsonify
import joblib
import os

app = Flask(__name__)

work_dir = os.path.dirname(os.path.abspath(__file__))

model = joblib.load('Fertilizer_Recommendation_GridSearch.pkl')
encode_ferti = joblib.load('Fertilizer_Recommendation_Encoder.pkl')



@app.route('/predict', methods=['POST'])

def predict():
    data = request.get_json()
    prediction = model.predict([[data['N'], data['P'], data['K']]])
    prediction = encode_ferti.inverse_transform(prediction)
    return jsonify({'Fertilizer': prediction[0]})

if __name__ == '__main__':
    app.run(port=5000, debug=True)