import sys
from flask import Flask, request, g
from flask_cors import CORS
from json import dumps

from werkzeug.exceptions import HTTPException
from services.security import decode_jwt_token

from routes.download import DOWNLOAD
from routes.upload import UPLOAD
from routes.base import BASE
from routes.user import USER
from routes.security import SECURITY

APP = Flask(__name__)
CORS(APP)

@APP.errorhandler(HTTPException)
def default_handler(err):
    '''Default HTTP handler'''
    response = err.get_response()
    # replace the body with JSON
    response.data = dumps({
        "code": err.code,
        "name": err.name,
        "description": err.description,
    })
    response.content_type = "application/json"
    return response

@APP.before_request
def extract_auth():
    if request.endpoint not in ["user.create_user", "user.get_user_details", "security.upload_rsa_key"]:
        headers = request.headers
        g.username = decode_jwt_token(headers.get("Authorization"), headers.get("key"))

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(HTTPException, default_handler)
APP.register_blueprint(DOWNLOAD)
APP.register_blueprint(UPLOAD)
APP.register_blueprint(BASE)
APP.register_blueprint(USER, url_prefix='/user')
APP.register_blueprint(SECURITY)

if __name__ == "__main__":
    APP.run(port=(int(sys.argv[1]) if len(sys.argv) == 2 else 8080), debug=True)