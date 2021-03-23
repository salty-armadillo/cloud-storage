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
| /download | GET | Download file by given filename | String : filename, String: location | {} |
| /upload | POST | Upload file | String : filename | {} |
| /filenames | GET | Get list of all files currently uploaded | | Array : List of filenames |

---

## Related documentation


