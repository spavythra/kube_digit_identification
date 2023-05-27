import React, { useState } from 'react';
import axios from 'axios';
import soundfile from './outputaudio.wav'

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // const convertTextToSpeech = async () => {
  //   try {
  //     await axios.post('/text-to-speech', translation, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'responseType': 'blob', // Replace with the appropriate media type
  //       },
  //     })
  //     .then((response) => {
  //       const blob = new Blob([response.data], { type: 'audio/wav' })
  //       const newUrl = URL.createObjectURL(blob);
  //       setAudioUrl(newUrl);
  //       setTest(newUrl);
  //       console.log(test)
  //     })
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const convertTextToSpeech = async () => {
      try {
        await axios.post('/text-to-speech', translation, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
        setAudioUrl(response.data);
      })
      } catch (error) {
        console.error(error.response.data);
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
    <form>
        <button type="button" value={translation} onClick={convertTextToSpeech}>Play</button>
        </form>
      {audioUrl && <audio src={soundfile} controls />}
    </div>

    {/* <button onClick={convertTextToSpeech}>Generate Audio</button>
      {audioUrl && (
        <div>
          <audio controls>
            <source src='./outputaudio.wav' type="audio/wav" />
          </audio>
        </div>
      )} */}
    </div>
  );
}

export default App;

