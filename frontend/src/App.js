import React, { Fragment, useState } from 'react';
import axios from 'axios';
import soundfile from './outputaudio.wav'
import Message from './components/Message';
import Progress from './components/Progress';

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
    setFilename(e.target.files[0].name);
  }

  const handleUpload = async (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append('image', selectedImage);

    // Send FormData to Flask back-end
    try {
      console.log("kkk")
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
        console.log(response);
        setPrediction(response.data.prediction)
        console.log(response);
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
      <h4 className='display-4 text-center mb-4'><i className='fab fa-react' /> React File Upload</h4>

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
      {/* {prediction ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{filename}</h3>
            <img style={{ width: '100%' }} src={`${filename}`} alt='' />
          </div>
        </div>
      ) : null} */}
      <div>{prediction && <p>Prediction: {prediction}</p>}</div>
    </Fragment>

    {/* <div>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleImage} />
        <button type="submit">Recognize Digit</button>
      </form>
      {prediction && <p>Prediction: {prediction}</p>}
    </div> */}

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

