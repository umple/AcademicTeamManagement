import os
from flask import Flask
from flask_cors import CORS
from main import initialize_routes
from security.auth import authentication
import app_config

# initilase a Flask app
app = Flask(__name__)

app.config.from_object(app_config)

# Handle cors
CORS(app, resources={r"*": {"origins": "*"}})

initialize_routes(app) # initialise the routes to use
authentication(app) # authenticate the user

if __name__ == '__main__':
    print(os.getenv("FLASK"))
    app.run(debug=True, host='0.0.0.0', port=os.getenv("FLASK"))
