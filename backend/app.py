from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import tempfile
import os

from methods.contourCorner import detect_contour
from methods.HarrisCorner import detect_harris
from methods.HitorMissCorner import detect_hitormiss
from methods.ShiTomasiCorner import detect_shitomasi

app = Flask(__name__)
@app.route("/")
def home():
    return jsonify({"message": "Flask server is running!"})

if __name__ == "__main__":
    app.run(debug=True)
    
methods_map = {
    "contour": detect_contour,
    "harris": detect_harris,
    "hitormiss": detect_hitormiss,
    "shitomasi": detect_shitomasi
}

@app.route('/process', methods=['POST'])
def process_image():
    method = request.form.get("method")
    image_file = request.files.get("image")

    if not method or method not in methods_map:
        return jsonify({"error": "Invalid method"}), 400

    if not image_file:
        return jsonify({"error": "No image uploaded"}), 400

    npimg = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    processed_image = methods_map[method](image)

    _, img_encoded = cv2.imencode('.png', processed_image)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    tmp_file.write(img_encoded)
    tmp_file.close()

    return send_file(tmp_file.name, mimetype='image/png')

