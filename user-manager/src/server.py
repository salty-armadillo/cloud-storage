import sys
from flask import Flask
from flask_cors import CORS
from json import dumps
from werkzeug.exceptions import HTTPException

from routes.download import DOWNLOAD
from routes.upload import UPLOAD
from routes.base import BASE
from routes.user import USER

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

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(HTTPException, default_handler)
APP.register_blueprint(DOWNLOAD)
APP.register_blueprint(UPLOAD)
APP.register_blueprint(BASE)
APP.register_blueprint(USER, url_prefix='/user')

if __name__ == "__main__":
    APP.run(port=(int(sys.argv[1]) if len(sys.argv) == 2 else 8081), debug=True, ssl_context='adhoc')