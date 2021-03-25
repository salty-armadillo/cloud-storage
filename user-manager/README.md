# User Manager

This is the local backend connected to the Electron frontend. It also helps to connect to the cloud backend and provides core functionality. It is a Python Flask server and will be packaged together with the Electron application.

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
    +-- user-manager
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
| /download | GET | Download file by given filename | String : filename, String: location | {} |
| /upload | POST | Upload file | String : filename | {} |
| /filenames | GET | Get list of all files currently uploaded | | Array : List of filenames |

---

## Key Features

### TLS Encryption (HTTPS)
The endpoints of this server are using HTTPS which allows for all traffic travelling to and from to be encrypted. This is a signifcant safety feature of this application due to the information being sent to it - e.g. passwords, encrypted files etc - which should be kept secure.

The implementation of this is using Flask's built-in HTTPS support - `app.run(ssl_context='adhoc')` - and the pyopenssl package.

There are some caveats with this however. As it is using a self-signed certificate this is obviously not a production-grade solution. For something a bit more solid, certificates issued by a Certificate Authority (such as LetsEncrypt's CertBot) would be the way to go.


---

## Related documentation
* Flask documentation: https://flask.palletsprojects.com/en/1.1.x/

