FROM python:3.11-slim

WORKDIR /app

COPY ml-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ml-service/app.py ml-service/train_model.py ml-service/saas_model.pkl ml-service/label_encoder.pkl ./

ENV PYTHONUNBUFFERED=1
EXPOSE 5000

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --timeout 60 app:app"]
