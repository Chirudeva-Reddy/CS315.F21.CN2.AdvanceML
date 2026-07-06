# Build context = repo root (Render Root Directory = repo root,
# Dockerfile Path = src/api/Dockerfile). Local compose sets context: ..
FROM python:3.11-slim
WORKDIR /app

COPY src/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# API code -> /app (uvicorn main:app)
COPY src/api/ .

# Bake trained model artifacts into the image so the deployed API has the
# same model context as local docker (no volume mount on Render).
COPY src/ml/model/ /ml/model/
ENV MODEL_DIR=/ml/model

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
