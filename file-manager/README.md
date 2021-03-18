# File Manager

This is the cloud backend connecting to the S3 instance and helping to store and retrieve files. It is a Python Flask server deployed as an AWS Lambda instance.

---

## Development startup (Windows)
```
cd ./src
set FLASK_APP=server.py
flask run
```

---

## Endpoints

| Endpoint | Method | Description |
|-|-|-|
| /download | GET | Download file by given filename |
