import sys
from flask import Flask
from flask_cors import CORS
from json import dumps
from routes.download import DOWNLOAD
from routes.base import BASE


def default_handler(err):
    '''Default HTTP handler'''
    print(err)
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description()
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__)
CORS(APP)

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, default_handler)
APP.register_blueprint(DOWNLOAD)
APP.register_blueprint(BASE)

if __name__ == "__main__":
    APP.run(port=(int(sys.argv[1]) if len(sys.argv) == 2 else 8080), debug=True)