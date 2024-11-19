from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
import os

app = FastAPI()

work_dir = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(work_dir, 'Fertilizer_Recommendation_GridSearch.pkl'))
encode_ferti = joblib.load(os.path.join(work_dir, 'Fertilizer_Recommendation_Encoder.pkl'))

class FertilizerRequest(BaseModel):
    N: float
    P: float
    K: float

@app.post("/fertilizer_recommendation")
async def fertilizer_recommendation(request: FertilizerRequest):
    data = request.dict()
    prediction = model.predict([[data['N'], data['P'], data['K']]])
    prediction = encode_ferti.inverse_transform(prediction)
    return {"Fertilizer": prediction[0]}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="debug")