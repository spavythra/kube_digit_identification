import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const convertTextToSpeech = async () => {
    try {
      console.log("kkkk")
      const response = await axios.post('/text-to-speech', translation, {
        headers: {
          'Content-Type': 'application/json', // Replace with the appropriate media type
        },
      });
      setAudioUrl(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    console.log(event.target.value)
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/translate', { text });
      setTranslation(response.data);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };
  // const inputRef = useRef(null);

  function handleImage(e) {
    console.log(e.target.files[0])
    setSelectedImage(e.target.files[0])
  }

  const handleUpload = async (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append('image', selectedImage);

    // Send FormData to Flask back-end
    try {
      await axios.post('/recognize_digit', formData)
      .then(response => setPrediction(response.data.prediction))
      console.log('Image uploaded successfully.');
    }
    catch(error) {
      console.error('Error uploading image:',error)
    }
  }


  return (
    <div>
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleImage} />
        <button type="submit">Recognize Digit</button>
      </form>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>

    <div>
      <form onSubmit={handleSubmit}>
        <button value={prediction} onClick={handleChange}>Translate</button>
      </form>
      {translation && <div>Translation: {translation}</div>}
    </div>
    <div>
    <form onSubmit={handleSpeech}>
        <button type="button" value={translation} onClick={convertTextToSpeech}>Play</button>
        </form>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
    </div>
  );
}

export default App;

