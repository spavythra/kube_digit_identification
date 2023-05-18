import React from 'react';
import axios from 'axios';

function Translate() {
    const translateText = async (text, targetLanguage) => {
        const endpoint = 'https://api.cognitive.microsofttranslator.com/translate';
        const subscriptionKey = 'YOUR_AZURE_TRANSLATOR_SUBSCRIPTION_KEY';

        try {
          const response = await axios.post(endpoint, [{
            text,
            to: [targetLanguage],
          }], {
            headers: {
              'Ocp-Apim-Subscription-Key': subscriptionKey,
              'Content-Type': 'application/json',
            },
          });

          // Process the translation response as needed
          const translatedText = response.data[0].translations[0].text;
          console.log('Translated text:', translatedText);
        } catch (error) {
          console.error('Translation failed:', error);
        }
      }
console.log(translateText)
  return (
    <div>
    {translateText()}
    </div>
  );
}

export default Translate;

