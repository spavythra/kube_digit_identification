# Digit Recognition App
### Developed with
* React JS Front-end
* Python Flask back-end
* microservices architecture
* containerized with Docker

### Features
Program flow is explained as a logical flow (Algorithm or pseudo code) of the Digit recognition is given in below steps.
1.	Browse the handwritten image as input to browse section.
2.	Clicking on upload button, uploads the image.
3.	Once the model predicted the digit, it will show the output as a string below the upload button.
4.	Clicking on translate button to translates the string.
5.	The translated text will be displayed under the translate button.
6.	Clicking on play button converts the translated text as speech.
7.	The audio will be displayed under the play button.
8.	Clicking on the audio, it will pronounce the translated digit.


## Installation
docker-compose up --build

## Deployment
--

## Acknowledgements
--

## Snapshots

* React app home page when we execute the code

![image](https://github.com/spavythra/kube_digit_identification/assets/87486009/c6438cef-4c7b-489a-9136-b049ddc4b1d1)


* When the User uploads the image, app shows the uploading percentage if the action is successful and shows the error message if it fails. After that it will show the predicted digit as string

![image](https://github.com/spavythra/kube_digit_identification/assets/87486009/42a898b2-1ce8-4a94-99ef-74df16cb2c9b)


*  After clicking on the translate button, the string will be translated from English to Finnish

![image](https://github.com/spavythra/kube_digit_identification/assets/87486009/7e6a69e4-56db-4537-9702-2018788d7bb8)


*  After clicking on the speech button, the translated number will be converted to speech using Azure speech cognitive service

![image](https://github.com/spavythra/kube_digit_identification/assets/87486009/f06f4ff2-10e1-4b3e-8302-c6172b998fc0)

=======
