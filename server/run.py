import os
from flask import Flask, redirect, request, session
from flask_restful import Api
from flask_cors import CORS
from main import initialize_routes
from uuid import uuid4
from app.controllers import student_controller
from app.utils.decryption_manager import getDecryptedSecret


app = Flask(__name__)
app.config["SECRET_KEY"] = str(uuid4())
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}})

initialize_routes(app, api)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=os.getenv("FLASK"))
