import io
import os
import sys
from flask import Flask, request, jsonify, send_file
from PIL import Image
import numpy as np
import tensorflow as tf
from num2words import num2words
import requests, uuid
from azure.cognitiveservices.speech import AudioDataStream
import azure.cognitiveservices.speech as speechsdk
import shutil

# Load the pre-trained digit recognition model
model = tf.keras.models.load_model("handwritten_digits.h5")

# Define the Flask app
app = Flask(__name__)

subscription_key = '5efaa84b0a274d7c800f70a964db12b4'
endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=fi'

def initialize_speech_synthesizer():
    speech_key = '6bded7ed71f240cfadb371b67265fc4c'
    service_region = 'northeurope'
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
    return synthesizer


@app.route('/text-to-speech', methods=['POST'])
def convert_text_to_speech():
    print('Hello world!', request.json, file=sys.stderr)
    speech_key = '6bded7ed71f240cfadb371b67265fc4c'
    service_region = 'northeurope'
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    file_name = "outputaudio.wav"
    file_config = speechsdk.audio.AudioOutputConfig(filename=file_name)
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=file_config)
    text = "The given number is "+request.json
    result = speech_synthesizer.speak_text_async(text).get()
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            current_directory = os.getcwd()  # Use the current working directory

            # Specify the path to the frontend folder relative to the current directory
            # frontend_folder = os.path.join(current_directory, '../frontend/src')

            # # Create a new folder inside the frontend folder
            # new_folder_name = 'my_folder'
            audio_file_path = os.path.join(current_directory, file_name)
            # os.makedirs(new_folder_path)
            stream = AudioDataStream(result)
            stream.save_to_wav_file(file_name)
            print(audio_file_path)
            shutil.copy('./outputaudio.wav', '../frontend/src')
    else :
        print("Error processing the audio")

    return send_file(audio_file_path, mimetype='audio/wav')

        # out = io.BytesIO()
        # synthesizer.save_wave(result, out)
        # return send_file(out, mimetype='audio/wav')

        # audio_stream = speechsdk.AudioDataStream(result.audio_data)
        #  # Specify the directory to save the audio file
        # current_directory = 'C:\\Users\\pavit\\Desktop\\mygit_remote\\digit_identification\\backend\\audio.wav'

        # # Generate a unique file name
        # # file_name = 'audio.wav'

        # print('Hello world!', result.reason, file=sys.stderr)
        # audio_stream.save_to_wav_file(current_directory)
        # # audio_file_path = os.path.join(current_directory, file_name)

        # return send_file(current_directory, mimetype='audio/wav')
    # else:
    #     return "Error occurred during speech synthesis"


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

    print("the file is ",file)
    # Read image file
    image = Image.open(io.BytesIO(file.read()))

    # Preprocess image for prediction
    image = preprocess_image(image)

    # Make prediction
    prediction = model.predict(np.array([image]))

    # Get predicted digit
    digit = np.argmax(prediction)

    # print(file)

    # file_path = os.path.join('../frontend/src', file.filename)

    # file.save(file_path)

    return jsonify({'prediction': str(num2words((digit)))})

if __name__ == '__main__':
    app.run(debug=True)