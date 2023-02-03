from flask import Flask, request, jsonify
from flask_restful import Api
import pandas as pd
import openpyxl
from main import initialize_routes

app = Flask(__name__)
api = Api(app)

initialize_routes(api)

@app.route("/import-excel", methods=["POST"])
def import_excel():
    file = request.files["file"]
    if not file:
        return "No file selected", 400
    if file:
        file_extension = file.filename.rsplit(".", 1)[1]
        if file_extension == "xlsx":
            data = pd.read_excel(file,na_values=["N/A", "na", "--","NaN", " "])
            return data.to_json(orient="records")
        elif file_extension == "csv":
            data = pd.read_csv(file,na_values=["N/A", "na", "--","NaN", " "])
            return data.to_json(orient="records")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
