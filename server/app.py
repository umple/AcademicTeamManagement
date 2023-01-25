from flask import Flask , request, jsonify, render_template
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "fsdaf"

@app.route("/test")
def test():
   return {"test":["t1","t2","t3"]}

@app.route("/uploadStudentList", methods=["POST"])
def upload():
    file = request.files["file"]
    data = pd.read_excel(file)
    return jsonify(data.to_dict())

if __name__ == "__main__":
    app.run()