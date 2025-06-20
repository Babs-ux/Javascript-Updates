

'use strict';


let secretNumber = Math.trunc(Math.random() * 10) + 1;
let highscore = 0;
let score = 10;


const displayMessage = function (message) {
    document.querySelector('.message').textContent = message;
}


document.querySelector('.check').addEventListener('click', function () {
    const guess  = Number(document.querySelector('.guess').value);
    console.log(guess);

   
    if (!guess) {
      
        displayMessage('⛔ No number!');
        
    } else if (guess === secretNumber) {
       
        displayMessage('🎉 Correct Number!');
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';

        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }

        
        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('.highscore').textContent = score;

        
    } else if (guess < 1 || guess > 10) {
        
        displayMessage('🚫 Number out of range! Choose a number between 1 and 10');

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
document.querySelector('.again').addEventListener('click', function () {
    console.log('Again button clicked');

    
    score = 10;
    document.querySelector('.score').textContent = score;
    

    
    secretNumber = Math.trunc(Math.random() * 10) + 1;

    
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';

    
    document.querySelector('.guess').value = '';
    document.querySelector('.number').textContent = '?';

    document.querySelector('.message').textContent = 'Start guessing...';

});