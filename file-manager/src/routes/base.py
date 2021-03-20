import json
from flask import Blueprint, request

BASE = Blueprint('base', __name__)

@BASE.route('/', methods=['GET'])
def base():
    return "can connect!"