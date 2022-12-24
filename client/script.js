//import bot svg from assets
import bot from './assets/bot.svg';
//import user svg from assets
import user from './assets/user.svg';
//pick the form element from the DOM
const form = document.querySelector('form');
//pick the chat container from the DOM
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
//create a function to load the bot message with 3 dots
function loader(element) {
  element.textContent = ""
  loadInterval = setInterval(() => {
    element.textContent += "."
    //if the text content is 4 dots, reset it to empty string
    if (element.textContent.length === 4) {
      element.textContent = ""
    }
  }, 300)

  }

  //create a function called typeText that takes in the text and the element to type in
  //Inside this function, create a variable called index that is equal to 0
  //create a variable called interval that is equal to setInterval
  //if we are still typing, add the next letter to the textContent of the element
  //if we are done typing, clear the interval
  function typeText(element,text) {
    let index = 0;
    const interval = setInterval(() => {
      element.innerHTML += text.charAt(index);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20)
  }

  //create a function to generate a unique id for each message to be able to map over them
  function generateUniqueID() {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecialString = randomNumber.toString(16)
    return `id-${timestamp}-${hexadecialString}`
  }

function chatStripe(isAi, value, uniqueId) {
return (  `<div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot':'user'}" />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `)
}
  
const handleSubmit = async (e) => {
  e.preventDefault();
  //get the data of the form
  const data = new FormData(form);
  //create the user chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  //clear the form
  form.reset();
  //create a unique id for the bot message
  const uniqueId = generateUniqueID();
  //create the bot chatstripe
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);
  //scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  //call the loader function
  loader(messageDiv);
  //fetch the response from the server
  const response = await fetch('https://codex-3jvb.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: data.get('prompt') })
  });
  //clear the loader interval
  clearInterval(loadInterval);
  //clear the message div
  messageDiv.innerHTML = "";
  //if response is ok, jsonify the response
  if (response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim()
    cosole.log(parseData)
    //call the typeText function
    typeText(messageDiv,parseData);
  }
  else {
    const err= await response.text();
    //if response is not ok, type the error message
    typeText(messageDiv, 'Something went wrong');
  console.log(err);
  }
}


//create a function to handle the submit event
form.addEventListener('submit', handleSubmit);
//create a function to handle the Enter key event
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
