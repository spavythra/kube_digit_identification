import io
import sys
from flask import Flask, request, jsonify, send_file
import base64
from PIL import Image
import numpy as np
import tensorflow as tf
from num2words import num2words
import requests, uuid, json
import azure.cognitiveservices.speech as speechsdk

# Load the pre-trained digit recognition model
model = tf.keras.models.load_model("handwritten_digits.model")

# Define the Flask app
app = Flask(__name__)

subscription_key = '5efaa84b0a274d7c800f70a964db12b4'
endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=fi'

def initialize_speech_synthesizer():
    speech_config = speechsdk.SpeechConfig(subscription="6bded7ed71f240cfadb371b67265fc4c", region="northeurope")
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
    return synthesizer


@app.route('/text-to-speech', methods=['POST'])
def convert_text_to_speech():
    print('Hello world!', request.json, file=sys.stderr)
    text = request.json
    synthesizer = initialize_speech_synthesizer()
    result = synthesizer.speak_text_async(text).get()
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        audio_stream = speechsdk.AudioDataStream(result.audio_data)
        audio_file_path = 'D:\IntelligentCloud\cnn-from-scratch\test_images'
        audio_stream.save_to_wav_file(audio_file_path)
        return send_file(audio_file_path, mimetype='audio/wav')
    else:
        return "Error occurred during speech synthesis"


@app.route('/translate', methods=['POST'])
def translate_text():
    if 'text' not in request.json:
        return 'No text provided', 400

    text = request.json['text']

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': 'northeurope',
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    data = [{'text': text}]

    response = requests.post(endpoint , headers=headers, json=data)
    translation = response.json()[0]['translations'][0]['text']

    return translation

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

    return jsonify({'prediction': str(num2words((digit)))})

if __name__ == '__main__':
    app.run(debug=True)