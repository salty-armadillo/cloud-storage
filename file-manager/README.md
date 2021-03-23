# File Manager

This is the cloud backend connecting to the S3 instance and helping to store and retrieve files. It is a Python Flask server deployed as an AWS Lambda instance.

---

## Development startup (Windows)
```
cd ./src
set FLASK_APP=server.py
python server.py
```
### Virtual environment
```
+-- root
    +-- file-manager
        +-- src
            .
            .
            .
    +-- venv
________________

cd root
venv\Scripts\activate
cd file-manager\src
set FLASK_APP=server.py
python server.py

```
---

## Endpoints

| Endpoint | Method | Description | Parameters | Response
|-|-|-|-|-|
| /download | GET | Download file by given filename | String : filename | String : pre-signed url |
| /upload | POST | Upload file | String : filename | Object : pre-signed url and fields |
| /filenames | GET | Get list of all files currently uploaded | | Array : List of filenames

---

## Related documentation
* AWS pre-signed URL - https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html
* boto3 pre-signed URL - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html

