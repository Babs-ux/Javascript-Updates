'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Golden Macatelli',
  movements: [200.67, 450, -400, 3000, -650, -130, 70.50, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',

  movementsDates: [
  '2025-01-13T18:44:22.501Z',
  '2025-01-27T09:12:37.824Z',
  '2025-02-14T21:05:08.613Z',
  '2025-03-03T11:48:19.774Z',
  '2025-03-29T08:15:44.982Z',
  '2025-04-17T16:26:03.185Z',
  '2025-06-02T19:33:56.447Z',
  '2025-07-01T10:51:36.790Z',
],
currency: 'GBP',
locale: 'en-UK'
};

const account2 = {
  owner: 'Kadisi Mitee',
  movements: [5000, 3400, -149.99, -790, -3210, -1000, 8500, -30.99],
  interestRate: 1.5,
  pin: 2222,
  type: 'premium',

  movementsDates: [
  '2025-01-13T18:44:22.501Z',
  '2025-01-27T09:12:37.824Z',
  '2025-02-14T21:05:08.613Z',
  '2025-03-03T11:48:19.774Z',
  '2025-03-29T08:15:44.982Z',
  '2025-04-17T16:26:03.185Z',
  '2025-06-02T19:33:56.447Z',
  '2025-07-01T10:51:36.790Z',
],
currency: 'USD',
locale: 'en-US',
};

const account3 = {
  owner: 'Babari Dumka Legbara',
  movements: [200, -300, 340, -150, -20.99, 50.60, 99.99, -60],
  interestRate: 0.7,
  pin: 3333,
  type: 'basic',

  movementsDates: [
  '2025-01-13T18:44:22.501Z',
  '2025-01-27T09:12:37.824Z',
  '2025-02-14T21:05:08.613Z',
  '2025-03-03T11:48:19.774Z',
  '2025-03-29T08:15:44.982Z',
  '2025-04-17T16:26:03.185Z',
  '2025-06-02T19:33:56.447Z',
  '2025-07-01T10:51:36.790Z',
],
currency: 'GBP',
locale: 'en-UK'
};


const account4 = {
  owner: 'Toni Kroos', //I ran out of names, so I used a fictional character
  movements: [430.25, 1000, 700.80, 50.60, 90],
  interestRate: 1,
  pin: 4444,
  type: 'standard',

  movementsDates: [
  '2025-01-13T18:44:22.501Z',
  '2025-01-27T09:12:37.824Z',
  '2025-02-14T21:05:08.613Z',
  '2025-03-03T11:48:19.774Z',
  '2025-03-29T08:15:44.982Z',
  '2025-04-17T16:26:03.185Z',
  '2025-06-02T19:33:56.447Z',
  '2025-07-01T10:51:36.790Z',
],
currency: 'EUR',
locale: 'de-DEU'
};

const accounts = [account1, account2, account3, account4];// Array of accounts

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


/* FUNCTIONS */
//Function for Movement dates



const formatMovementDate = function (date, locale) {
  
  // Helper function to calculate the number of full days between two dates
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // Calculate how many days have passed since the provided date
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed); // for debugging 

  // Return human-friendly labels for recent dates
  if (daysPassed === 0) return 'Today';        
  if (daysPassed === 1) return 'Yesterday';     
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // For older dates, return a localized formatted string (e.g. 'Jul 2, 2025')
  return new Intl.DateTimeFormat(locale).format(date);
};

//Function for Currencies
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/*Function to display Withdrawals, deposits and the Balance .
This function takes an array of movements and a boolean to sort them. */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements); //Called the function to display movements of account1

// Function to calculate the balance of an account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);

  /* const balanceGBP = (acc.balance * euroToGBP).toFixed(2);
  console.log(`Balance in GBP: £${balanceGBP}`); */
};
//calcDisplayBalance(account1.movements); //Called the function.

// Functions to calculate the summary of deposits, withdrawals and interest earned respectively
const calcDisplaySummary = function (acc) {
  // Calculate total deposits
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  // Calculate total withdrawals
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  // Calculate interest earned from deposits
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >=1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//calcDisplaySummary(account1.movements); //Called the function to display summary of account1


//Function to create usernames for each account using Initials
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  });
};
createUsernames(accounts);
console.log(accounts);

/*Function to improve readability and avoid repetition
 This function updates the UI with the current account's movements, balance, and summary */
const updateUI = function (acc) {
  // Display the withdrawals and deposits
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary(income, withdrawals and interest earned)
  calcDisplaySummary(acc);
};

//Logout Timer
const LogoutTimer = function () {
  const tick = function() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    
    labelTimer.textContent = `${min}:${sec}`;

    //When time runs out, logout user
    if (time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }
    //Decrease by 1s
    time--;

  }
  //set time to 5 minutes
  let time = 300;

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//Spinning Logo Function
const logo = document.querySelector('.logo');

const spinLogo = function () {
  logo.classList.add('spin');

  // Remove the class after the animation completes (1s in this case)
  setTimeout(() => {
    logo.classList.remove('spin');
  }, 5000);
};

//Event handlers for login, transfer, loan and close account respectively
let currentAccount, timer; // Variable to store the currently logged-in account


/* Login event handler
 This function handles the login process when the user clicks the login button */
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent the default form submission behavior (basically reloading the page )
 // console.log('Login button clicked'); // Log to console for debugging


  // Find the account that matches the username and pin
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.toUpperCase());// Convert input to uppercase to match the username format

  // If account is found, display welcome message and movements
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1; // Show the app

//Experimenting API
 const now = new Date();
 const options = {
 hour: 'numeric',
 minute: 'numeric',
 day: 'numeric',
 month: 'numeric',
 year: 'numeric',
}; 

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);


    inputLoginUsername.value = inputLoginPin.value = ''; // Clear input fields
    inputLoginPin.blur(); // Remove focus from pin input

    console.log(`Logged in as: ${currentAccount.owner}`); // Log the logged-in account

    //calling function
    if(timer) clearInterval(timer);
    timer = LogoutTimer();

    updateUI(currentAccount); // Calling function to avoid repetition

    /* Original idea was to display movements, balance and summary.
    Created a function instead to avoid repetition.

    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount.movements);
     */
  } else{
    labelWelcome.textContent = 'Login failed. Please try again, Perhaps the pin is incorrect!';
    labelWelcome.style.color = 'red'; 
    containerApp.style.opacity = 0; // Hide the app if login fails
    console.log('Login failed'); // Log to console for debugging

    // Reset the labelWelcome after 3 seconds
    setTimeout(() => {
      labelWelcome.textContent = `Log in to get started`;
      labelWelcome.style.color = ''; // Reset text color
  }, 2750); // Reset after 2.75 seconds
  }
});

/* Transfer event handler
This function handles the transfer of money between accounts when the user clicks the transfer button */
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value.toUpperCase()
  );

  // Afterwards, clear the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  // Check if the transfer is valid
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Show processing message immediately
    labelWelcome.textContent = `Transfer of €${amount} to ${receiverAccount.owner.split(' ')[0]} is being processed...`;
    labelWelcome.style.color = '#082d65';

    // Simulate delay before performing transfer
    setTimeout(() => {
  // Spin the logo when transfer happens
  spinLogo();

  // Perform the transfer
  currentAccount.movements.push(-amount);
  receiverAccount.movements.push(amount);

  //Adding date
  currentAccount.movementsDates.push(new Date ());
  receiverAccount.movementsDates.push(new Date ());


  // Update UI after transfer
  updateUI(currentAccount);

  //reset timer
  clearInterval(timer);
  timer = LogoutTimer();

  // Show success message
  labelWelcome.textContent = `Transfer of €${amount} to ${receiverAccount.owner.split(' ')[0]} was successful.`;
  labelWelcome.style.color = 'green';

  setTimeout(() => {
    labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
    labelWelcome.style.color = '';
  }, 3000);

}, 3000); 

  } else {
    // Show failure message
    labelWelcome.textContent = 'Transfer failed. Please check the amount and recipient.';
    labelWelcome.style.color = 'red';

    // Reset the welcome message after 3 seconds
    setTimeout(() => {
      labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = '';
    }, 3000);
  }
});


// Loan event handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the loan amount from the input field
  const amount = +inputLoanAmount.value;

  if(amount > 0 && // Check if the amount is positive
    currentAccount.movements.some(mov => mov >= amount * 0.1)) { // Check if there is at least one deposit that is at least 10% of the loan amount
    // Add the loan amount to the current account's movements
    currentAccount.movements.push(amount);

    //Adding date
    currentAccount.movementsDates.push(new Date ());

    console.log(`Loan of €${amount} granted.`); // Log loan details

     //Create a message to ask the user to wait for 10 seconds
    labelWelcome.textContent = `Your loan request of €${amount} is being processed. Please be patient.`;
    labelWelcome.style.color = '#116268'; 

      //timeout for a delay before updating the UI
    setTimeout(() => {
      // Spin the logo when loan is approved
      spinLogo(9500);

      // Update the welcome message to indicate loan approval
      labelWelcome.textContent = `Loan of €${amount} approved, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = 'green'; 
      // Update UI after loan
      updateUI(currentAccount); 

      //reset timer
      clearInterval(timer);
      timer = LogoutTimer();

    }, 6500); 

     //reset the Welcome message after 14 seconds
    setTimeout(() => {
      labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = ''; 
  }, 11500); 


    // Clear the input field
    inputLoanAmount.value = ''; // Clear input field
   
  } else {
    // Create a message to inform the user that the loan request failed
    labelWelcome.textContent = 'Loan request failed. Please check the amount and your deposits.';
    labelWelcome.style.color = 'red'; // Change text color to red

    // Reset the labelWelcome after 3 seconds
    setTimeout(() => {
      labelWelcome.textContent = `Would you like to try again?, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = ''; // Reset text color

  }, 3500);

}
});
//Close (Delete) account event handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Get the username and pin from the input fields
  if (
    inputCloseUsername.value.toUpperCase() === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // Finding the index of the account to be closed
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Remove the account from the accounts array
    accounts.splice(index, 1);

    // Hide the UI and reset the welcome message
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Account closed successfully.';
    labelWelcome.style.color = 'green'; // Change text color to green

    setTimeout(() => {
      spinLogo();
      labelWelcome.textContent = `Log in to get started`;
      labelWelcome.style.color = ''; // Reset text color
    }, 4500); // Reset after 3 seconds

    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

// Sort movements event handler
let sorted = false; // tracking the sort state

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  //  processing message
  labelWelcome.textContent = `Sorting...`;
  labelWelcome.style.color = '#082d65';
  spinLogo();

  
  setTimeout(() => {
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;

    
    labelWelcome.textContent = `Sorted successfully, Mr. ${currentAccount.owner.split(' ')[0]}`;
    labelWelcome.style.color = 'green';

    
    setTimeout(() => {
      labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = '';
    }, 3500);

  }, 3000); 
});

/* const user = 'Golden Macatelli';
//Testing username creation
const username = user
.toLowerCase()
.split(' ')
.map(name => name[0])
.join('').
toUpperCase();

console.log(username); // GM (Initials capitalized) */

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Data for understanding and testing purposes

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
////////////////////// Testing areas for better Understanding, better User experience//////////////////////
/* this code calculates the total deposits in USD and GBP from the movements array.
const eurToUsd = 1.1;
const euroToGBP = 0.85;

// Calculate total deposits in USD
const TotalDepositsUSD = movements
.filter(mov => mov > 0)
.map(mov => mov * eurToUsd.toFixed(2)) // Convert to USD 
.reduce((acc, mov) => acc + mov, 0)
.toFixed(2); // Round the total to 2 decimal places

const TotalDepositsGBP = movements
.filter(mov => mov > 0)
.map(mov => mov * euroToGBP) // Convert to GBP
.reduce((acc, mov) => acc + mov, 0)
.toFixed(2); // Round the total to 2 decimal places

console.log(`Total Deposits in USD: $${TotalDepositsUSD}`);
console.log(`Total Deposits in GBP: £${TotalDepositsGBP}`); 

//FIND METHOD
const FirstWithdrawal = movements.find(mov => mov < 0); // Returns the first negative movement
console.log(FirstWithdrawal); // Output: -400

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Babari Dumka Legbara');
console.log(account); // Output: Account object for Babari 


//FIND INDEX METHOD
// Finding the index of the account to be closed
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Remove the account from the accounts array
    accounts.splice(index); 

// LAST INDEX METHOD
console.log(movements);
const lastWithdrawal = movements.findLast(mov => mov < 0);
console.log(lastWithdrawal)    

// challenge to print 'Your latest large moevement was X movements ago'
const largemovements = movements
.filter(mov => mov > 2000)
.splice(movements, 1); // Get the last large movement

const latestlargemovement = movements.findLastIndex(
  mov => Math.abs(mov) > 2000);
  console.log(
    `Your latest largest movement was ${movements.length - latestlargemovement} movements ago, and it was €${largemovements}.`
  ); 


//Spin Logo Idea (Function to Spin the logo when some actions are performed)
const logo = document.querySelector('.logo');

const spinLogo = function () {
  logo.classList.add('spin');

  // Remove the class after the animation completes (1s in this case)
  setTimeout(() => {
    logo.classList.remove('spin');
  }, 1000);
};   

//Sorting arrays
// a - b (Ascending order)
// b - a (Descending order)
movements.sort((a, b) => a - b);
console.log(movements); // Sorted movements array 

//Create Date
const now = new Date();
console.log(now); */
//Displaying Mr. Golden's account in GBP
