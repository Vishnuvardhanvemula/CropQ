# # Use an official Python runtime as a parent image
# FROM python:3.9-slim

# # Set the working directory
# WORKDIR /app

# # Copy the requirements file for both FastAPI and Streamlit
# COPY requirements.txt .

# # Install dependencies
# RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the application code
# COPY api/ ./api/
# COPY app/ ./app/
# # Copy the .env file into the image
# COPY .env .env

# # Expose ports for both applications
# EXPOSE 8000 8501

# ENV PYTHONPATH="/app"  

# CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port 8000 & streamlit run app/streamlit_app.py --server.port 8501 --server.address 0.0.0.0"]
# # Default command to run FastAPI
# # CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

# # To run the Streamlit app, you can override the CMD at runtime:
# # docker run -p 8501:8501 <image_name> streamlit run app/streamlit_app.py --server.port=8501 --server.address=0.0.0.0


# # Start both applications using a shell command
# # CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port 8000 & streamlit run app/streamlit_app.py --server.port=8501 --server.address=0.0.0.0"]
# # docker run -p 8501:8501 a73a42c6c754 streamlit run app/streamlit_app.py --server.port=8501 --server.address=0.0.0.0 










# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY api/ ./api/
# Copy the .env file into the image
COPY .env .env

# # Expose the FastAPI port
# EXPOSE 8000

# Set the PORT environment variable
ENV PORT=8000

# Expose the port that the app runs on
EXPOSE $PORT


# Set Python path
ENV PYTHONPATH="/app"  

# Default command to run FastAPI
CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port $PORT"]
