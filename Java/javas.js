const images = [
	'Assets/bg_photo1.jpg',
	'Assets/bg_photo2.jpg',
	'Assets/bg_photo3.jpg'
];
let index = 0;
const slideshow = document.getElementById('slideshow');

function changeBackground() {
  slideshow.style.backgroundImage = `url('${images[index]}')`;
  index = (index + 1) % images.length;
}

changeBackground(); // first image
setInterval(changeBackground, 3500); // change every 3.5 seconds
// JavaScript Document