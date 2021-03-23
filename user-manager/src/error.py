'''HTTP errors to be raised to the frontend.'''
from werkzeug.exceptions import HTTPException

class AccessError(HTTPException):
    '''Raised if the user does not have access to the resource specified.'''
    code = 400
    message = 'No message specified'

class InputError(HTTPException):
    '''Raised if the input given to the endpoint is invalid.'''
    code = 400
    message = 'No message specified'
