import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
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
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleImage} />
        <button type="submit">Recognize Digit</button>
      </form>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
}

export default App;

