import io
from flask import Flask, request, jsonify
import base64
from PIL import Image
import numpy as np
import tensorflow as tf

# Load the pre-trained digit recognition model
model = tf.keras.models.load_model("handwritten_digits.model")

# Define the Flask app
app = Flask(__name__)

# Preprocess image
def preprocess_image(image):
    # Convert to grayscale
    image = image.convert('L')

    # Resize image to 28x28 pixels
    image = image.resize((28, 28))

    # Convert to numpy array
    image = np.array(image)

    # Invert image (black background, white digit)
    image = 255 - image

    # Reshape to 1D array of 784 values
    image = image.reshape(28, 28)

    # Normalize pixel values to range [0, 1]
    image = image / 255.0

    return image

@app.route('/recognize_digit', methods=['POST'])
def recognize_digit():
    # Get uploaded file from request
    file = request.files['image']

    # Read image file
    image = Image.open(io.BytesIO(file.read()))

    # Preprocess image for prediction
    image = preprocess_image(image)

    # Make prediction
    prediction = model.predict(np.array([image]))

    # Get predicted digit
    digit = np.argmax(prediction)

    return jsonify({'prediction': str(digit)})

if __name__ == '__main__':
    app.run(debug=True)