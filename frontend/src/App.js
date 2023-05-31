import React, { Fragment, useState } from 'react';
import axios from 'axios';
import soundfile from './outputaudio.wav'
import Message from './components/Message';
import Progress from './components/Progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState('');
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

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

  function handleImage(e) {
    setSelectedImage(e.target.files[0])
    setFilename(e.target.files[0].name);
  }

  const handleUpload = async (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append('image', selectedImage);

    // Send FormData to Flask back-end
    try {
      await axios.post('/recognize_digit', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          )
        }
      })
      .then(setTimeout(() => setUploadPercentage(0), 10000))
      .then(response => {
        setPrediction(response.data.prediction)
      })

      setMessage('File Uploaded')
      setTimeout(() => setMessage(''), 10000)
      console.log('Image uploaded successfully.');
    }
    catch(error) {
      console.error('Error uploading image:',error)
      setMessage('There was a problem with the server');
      setUploadPercentage(0)
    }
  }


  return (
    <div className='container mt-4'>
      <h4 className='display-4 text-center mb-4'><FontAwesomeIcon icon={faUserSecret} /> Digit Recognition App</h4>

    <div className='p-2 border border-info'>
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={handleUpload}>
        <div className='custom-file mb-4'>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className='custom-file-input'
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      <div>{prediction && <p className="fs-4 p-1 custom-file-label bg-success text-center mt-4 text-white">The predicted number is <b>{prediction}</b></p>}</div>
    </Fragment>

    <div>
      <form onSubmit={handleSubmit}>
        <button className='btn btn-primary btn-block mt-4' value={prediction} onClick={handleChange}>Translate</button>
      </form>
      {translation && <div className="fs-4 p-1 custom-file-label bg-success text-center mt-4 text-white">Finnish translation for the given number is <b>{translation}</b></div>}
    </div>
    <div>
    <form>
        <button type="button" className='btn btn-primary btn-block mt-4' value={translation} onClick={convertTextToSpeech}>Play</button>
        </form>
      {audioUrl && <audio className="w-100 mt-4" id="plyr-audio-player" src={soundfile} controls />}
    </div>
    </div>
    </div>
  );
}

export default App;

