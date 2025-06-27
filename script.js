

'use strict';

//The Secret Number
let secretNumber = Math.trunc(Math.random() * 10) + 1;
let highscore = 0;
let score = 10;

//Function for Displaying Messages
const displayMessage = function (message) {
    document.querySelector('.message').textContent = message;
}


document.querySelector('.check').addEventListener('click', function () {
    const guess  = Number(document.querySelector('.guess').value);
    console.log(guess);

   // Display messages 
   //When there is no input
    if (!guess) {
       // document.querySelector('.message').textContent = '⛔ No number!';
        displayMessage('⛔ No number!');
        //When player wins, the background color changes to green
    } else if (guess === secretNumber) {
       // document.querySelector('.message').textContent = '🎉 Correct Number!';
        displayMessage('🎉 Correct Number!');
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';

        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }

        //Making sure The secret Number is hidden and Highscore is updated
        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('.highscore').textContent = score;

        //When the guess is out of range
    } else if (guess < 1 || guess > 10) {
        //document.querySelector('.message').textContent = '🚫 Number out of range! Choose a number between 1 and 10';
        displayMessage('🚫 Number out of range! Choose a number between 1 and 10');

    //When the guess is not equal to the secret number    
    }else if (guess !== secretNumber) {
        if(score > 1) {
        document.querySelector('.message').textContent = guess > secretNumber ? '📈 Too high! Try Again' : '📉 Too low! Try Again' ;
        score--;
        document.querySelector('.score').textContent = score;

        }else {
           // document.querySelector('.message').textContent = '💥 You lost the game!';
            displayMessage('💥 You lost the game!');
            document.querySelector('body').style.backgroundColor = '#bc2727';
            document.querySelector('.number').style.width = '30rem';
            document.querySelector('.score').textContent = 0;
        }
    } 
    

});

/* Adding functionality to the 'Again' button. and allow the player to play again */
document.querySelector('.again').addEventListener('click', function () {
    console.log('Again button clicked');

    //Resetting the score and keeping the highscore
    score = 10;
    document.querySelector('.score').textContent = score;
    

    //Generating a new secret number
    secretNumber = Math.trunc(Math.random() * 10) + 1;

    //Resetting the background color and number width
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';

    //Resetting the input field and the number displayed
    document.querySelector('.guess').value = '';
    document.querySelector('.number').textContent = '?';

    document.querySelector('.message').textContent = 'Start guessing...';

});