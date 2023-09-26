// Import the p5.js library
import { sketch } from "p5js-wrapper";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

// Define global variables
let buttonX, buttonY;
let buttonSize = 50;
let isButtonHovered = false;
let isClicked = false;
let t = 0.5; // Time variable for Perlin noise
let noiseFactor = 1.5; // Adjust this value to control the movement intensity
let particles = [];
let emoji = "👁️"; // Initial emoji
let bg = 255;
let particlesOn = true;
let oscillator;
let words = [
  "Enter",
  "Just Come In",
  "Won't you come indside?",
  "Hurry Up",
  "Don't Worry",
  "Forget Everything",
  "It's Easy",
];
let osc, playing, freq, amp;
let wordsToShow = [];
let lastWordTime = 0;
let nextWordTime = 10;

sketch.setup = function () {
  createCanvas(windowWidth, windowHeight); // Set canvas dimensions to match window size
  buttonX = random(width - buttonSize);
  buttonY = random(height - buttonSize);
};

sketch.draw = function () {
  background(bg);

  // Update the Perlin noise values
  let noiseX = noise(t);
  let noiseY = noise(t + 1000);

  // Map the noise values to the canvas size
  let targetX = map(noiseX, 0, 1, 0, width - buttonSize);
  let targetY = map(noiseY, 0, 1, 0, height - buttonSize);

  // Smoothly move the button towards the target position with an adjustable factor
  if (!isClicked) {
    buttonX = lerp(buttonX, targetX, noiseFactor);
    buttonY = lerp(buttonY, targetY, noiseFactor);
  }

  // Check if the mouse is hovering over the button
  isButtonHovered =
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonSize &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonSize;

  // Draw the button
  if (particlesOn == true) {
    fill(isButtonHovered ? color(255, 0, 0) : color(0, 0, 0));
  } else {
    fill(color(0, 0, 0));
  }

  noStroke();
  rect(buttonX, buttonY, buttonSize, buttonSize);

  // Display the emoji on the button
  textSize(30);
  textAlign(CENTER, CENTER);
  text(emoji, buttonX + buttonSize / 2, buttonY + buttonSize / 2);

  // Emit particles when the button is hovered over
  if (isButtonHovered && particlesOn == true) {
    for (let i = 0; i < 5; i++) {
      particles.push(
        new Particle(buttonX + buttonSize / 2, buttonY + buttonSize / 2)
      );
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // If the button has been clicked, change emoji, fall to the bottom, sleep, and move to the next page
  if (isClicked) {
    if (buttonY < windowHeight - buttonSize) {
      buttonY += 2; // Fall down
    } else {
      setTimeout(() => {
        window.location.href = "welcome.html"; // Redirect to the next page after a 5-second delay
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  }

  // Show words randomly on the canvas for a split second
  if (millis() > nextWordTime) {
    let wordToShow = random(words);
    let wordSize = random(40, 100);
    let wordX = random(width - wordSize);
    let wordY = random(height - wordSize);

    wordsToShow.push({ word: wordToShow, size: wordSize, x: wordX, y: wordY });
    lastWordTime = millis();
    nextWordTime = millis() + random(3000, 5000); // Random interval between 3 and 15 seconds
  }

  // Display words for a split second
  for (let i = wordsToShow.length - 1; i >= 0; i--) {
    let wordObject = wordsToShow[i];
    fill(0);
    textSize(wordObject.size);
    textAlign(CENTER, CENTER);
    text(
      wordObject.word,
      wordObject.x + wordObject.size / 2,
      wordObject.y + wordObject.size / 2
    );
    wordsToShow.splice(i, 1); // Remove displayed word
  }

  // Increment time variable for Perlin noise
  t += 0.01;
};

sketch.mousePressed = function () {
  if (isButtonHovered && !isClicked) {
    // Change emoji
    emoji = "☠️";
    bg = 0;
    isClicked = true;
    particles = [];
    particlesOn = false;
  }
};

// Dynamically resize the canvas when the window is resized
sketch.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 5;
  }

  display() {
    noStroke();
    fill(255, 0, 0, this.lifespan); // Red with fading alpha
    ellipse(this.position.x, this.position.y, 2, 2);
  }

  isDead() {
    return this.lifespan < 0;
  }
}
function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start();
  playing = true;
}

function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  playing = false;
}
