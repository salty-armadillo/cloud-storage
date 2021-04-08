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
| /filenames | GET | Get list of all files currently uploaded | | Array : List of filenames |
| /file | DELETE | Delete file from S3 | String: filename | |
| /user/create | POST | Creates a new user | String: username, String: email, String: password | |
| /user/details | GET | Retrieves user details | String: username | Object: user details |
| /rsa/upload | POST | Accepts a public RSA key | File: public RSA key | |
| /rsa/delete | DELETE | Removes a public RSA key | String: key ID | |

---

## Key Features

### Deployment
This application will be deployed as an AWS Lambda function with the assistance of Zappa (https://github.com/zappa/Zappa). Zappa helps to wrap the application up and creates the required AWS CloudFormation template to deploy the whole stack (AWS API Gateway for endpoints, AWS S3 bucket for snapshot).

#### TLS Encryption (HTTPS)
The TLS Encryption for the endpoints of this application are taken care of by AWS API Gateway. A base HTTPS URL is automatically generated and listed by the Zappa helper and this will then be referenced by the local backend application. The encryption of this endpoint is very important to the overall security of the application due to the sensitive information (e.g. pre-signed urls, user details) being sent.

### Pre-Signed URLs
Pre-Signed URLs are being used to both upload and download the files. Rather than having this application download the file from the S3 bucket directly and send it to the local application via HTTPS or SFTP, this application is requested a pre-signed url from the S3 instance and providing it to the local application. The local application can then download or upload the file directly.

There are a few benefits with this approach. The primary one is that the file will spend less time in transit which reduces the amount of time that it is vulnerable. Additionally, it also means that the AWS IAM credentials are only required in the cloud application and do not need to be stored in the local application. If there were indeed stored in the local application this is a massive risk when considering scalability - if you have hundreds of version of the application then they will each have to have a copy of the credentials.

A few risks with this approach come from the idea that the URL is pre-signed. No further authentication is required which poses an issue if an attacker was able to intercept the URL. In order to mitigate this there is a very short expiry of 5 minutes on the URL - considering that the local application should be using it straight-away, the extra time is for network issues. Additionally, the URL is signed with the name of the file to be uploaded or downloaded which can prevent other malicious content from being added.

### Database Access
The MySQL database is hosted by an AWS RDS instance and has basic authentication (username, password) as well as IAM access. When running locally I have been accessing the instance with the basic authentication however, when deployed the application will be using AWS IAM credentials. The IAM user being used has limited permissions and can only access the <strong>required</strong> services - this is the principle of <strong>least privilege access</strong>.

---

## Related documentation and references
* AWS pre-signed URL - https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html
* boto3 pre-signed URL - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html
* Running AWS Lambda in a VPC: https://gist.github.com/reggi/dc5f2620b7b4f515e68e46255ac042a7
* Protecting database queries against SQLi: https://realpython.com/prevent-python-sql-injection/#using-query-parameters-in-sql
