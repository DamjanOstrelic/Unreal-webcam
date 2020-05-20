const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false }) //navigator returns promise so we use .then
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream; //set the source of the video to be object -> localMediaStream
      video.play();
    })
    .catch((err) => {
      console.error("error", err); //catch any error, e.g. denied permission for webcam
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight; //we need to make the canvas same size as video before painting
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    //return to have access to setInterval later on
    ctx.drawImage(video, 0, 0, width, height); //every 16ms draw image from video to canvas
    let pixels = ctx.getImageData(0, 0, width, height); //take the pixels out
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //function already linked to button in html
  //now let's add the photo capture functionality
  snap.currentTime = 0;
  snap.play(); //play the camera snap sound
  const data = canvas.toDataURL("image/jpeg"); //first take the data out of the canvas - this is base64 format
  const link = document.createElement("a"); //create a link that we'll use for downloading the image
  link.innerHTML = `<img src=${data} alt="capture"/>`; //set link to be an image
  link.href = data; //set the link to link to data (image)
  link.setAttribute("download", "capture");
  strip.insertBefore(link, strip.firstChild); //insert the link into the strip element (div) at the start
}

function rgbSplit(pixels) {
  for (
    let i = 0;
    i < pixels.data.length;
    i += 4 //4 because values are [r, g, b, alpha] for each pixel
  ) {
    pixels.data[i - 30] = pixels.data[i + 0];
    pixels.data[i + 60] = pixels.data[i + 1];
    pixels.data[i - 90] = pixels.data[i + 2];
  }
  return pixels;
}
getVideo();
video.addEventListener("canplay", paintToCanvas); //add event listener to start running paintToCanvas automatically
//canplay is an event a video emmites when played
