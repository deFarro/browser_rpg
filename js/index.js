'use strict';

const mainWindow = document.getElementById('root');
const firstScreen = document.createElement('div');
firstScreen.classList.add('fistScreen');

const title = document.createElement('h1');
title.classList.add('gameTitle');
title.textContent = 'Future In The Past';
firstScreen.appendChild(title);

const fistContent = document.createElement('p');
fistContent.classList.add('modalFrame');
fistContent.textContent = 'START ADVENTURES';
firstScreen.appendChild(fistContent);

mainWindow.appendChild(firstScreen);
fistContent.addEventListener('click', initCharacterSetup);

function initCharacterSetup(event) {
  event.target.innerHTML = 'SETUP YOUR CHARACTER</br>Name</br>S</br>D</br>I</br>L</br>OK';
  title.classList.add('clicked');
  event.target.classList.add('appear');
}
