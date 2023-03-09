import os
from flask import Flask, redirect, request, session
from flask_restful import Api
from flask_cors import CORS
from main import initialize_routes
from uuid import uuid4

app = Flask(__name__)
app.config["SECRET_KEY"] = str(uuid4())
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}})

initialize_routes(api)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=os.getenv("FLASK"))
