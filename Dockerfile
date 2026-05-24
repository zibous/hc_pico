FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    TZ=Europe/Vaduz

LABEL maintainer="Peter Siebler <peter.siebler@gmail.com>" \
      application="home-picokostal" \
      com.centurylinklabs.watchtower.enable="false" \
      dockerhand.check-update="false"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data /app/logs

EXPOSE 5098

HEALTHCHECK --interval=60s --timeout=5s --retries=3 --start-period=60s \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:5098/api/health')"

CMD ["python3", "app/main.py"]
