const fetchUrl = "https://dog.ceo/api/breeds/image/random";
const output = document.getElementById('output');
const playButton = document.getElementById('dogButton');
const roundCount = document.getElementById('round-count');
const thePrompt = document.getElementById('question');
const tryAgain = document.getElementById('try-again');
const yourScore = document.getElementById('your-score');

let canAnswer = true;
let hidden = false;

let answer = '';
let breeds = [];
let finalResult = [];

let count = 0;
let score = 0;

output.addEventListener('click', handleSelection)

//promise to get the dog API 
const customPromise = async() => {
  const response = await fetch (fetchUrl);
  const data = await response.json();
  const url = await data.message;
  const breed = url.split("/")[4];
  return {url, breed};
};

//creating the image from the DOM to turn the API into an actual image
const dogImg = async() => {
    output.innerHTML = '';
    thePrompt.innerHTML = ''; 
    breeds = [];
    canAnswer = true;
    tryAgain.innerHTML = "";
    playButton.innerText = "Next";
    playButton.setAttribute("disabled", true);
    countingRound();

    for(i = 0; i<4; i++) {
      const div = document.createElement('div');
      div.className = 'dog-img'
      const dog = document.createElement('img');
      const {url, breed} = await customPromise();
      breeds.push(breed);
      dog.src = url;
      dog.setAttribute('data-breed', breed)
      div.append(dog);
      output.append(div); 
  } 
      setRandomAnswer()
}

//counting the rounds so the user knows what question they are on. 
function countingRound() {
  if (count >= 0) {
    roundCount.innerText = `Round ${count + 1}`
  }
}

//eventlistener function - handles whether or not the user can answer and getting the correct anwswer 
function handleSelection(e) {
  playButton.removeAttribute("disabled");
  count++
  if (canAnswer) {
    canAnswer = false;
    const breed = e.target.getAttribute('data-breed');
  if (breed) {
    giveFeedback(breed === answer)
    }
  } 
}

//Creates the prompt for the random dog breed 
function setRandomAnswer() {
  answer = breeds[Math.floor(Math.random()* breeds.length)];
  const prompt = document.createElement('div');
  prompt.innerText = `Which image shows the ${answer} breed?`
  thePrompt.append(prompt);
}

//Tells user if they are correct/incorrect 
function giveFeedback(isCorrect) {
  const feedback = document.createElement('div');
  const message = isCorrect ? 'CORRECT' : 'INCORRECT'
  if (isCorrect) {
    calculateScore()
    feedback.innerText = `That is ${message}!`;
    thePrompt.append(feedback)
  } else {
    tryAgain.innerHTML = "Sorry, wrong answer! Click Next to continue!";
    yourScore.innerText = `Your score is ${score} out of 5`
  }
}

//calculating the score 
function calculateScore() { 
    score++;
    yourScore.innerText = `Your score is ${score} out of 5`
}

//ending the game after 5 clicks and reseting the game
function endGame() {
  if (count === 5) {
    yourScore.innerText = `Your score is ${score} out of 5! Try again by hitting the Reset button!`
    hidePlayButton()
    output.innerHTML = "";
    tryAgain.innerHTML = "";
    thePrompt.innerHTML = "";
  }
}

//hiding the play button
function hidePlayButton() {
  hidden = !hidden;
  if (hidden) {
    document.getElementById('dogButton').style.visibility = 'hidden';
  } else {
    document.getElementById('dogButton').style.visibility = 'visable';
  }
}

playButton.addEventListener('click', () => {
  if (count <5) {
    dogImg()}
    endGame()
});
