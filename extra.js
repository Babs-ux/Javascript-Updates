'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Golden Macatelli',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kadisi Mitee',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Babari Dumka Legbara',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
 
};


const account4 = {
  owner: 'Clark Kent', //I ran out of names, so I used a fictional character
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
/*Function to display Withdrawals, deposits and the Balance .
This function takes an array of movements and a boolean to sort them. */
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // Clear existing movements

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">€${Math.abs(mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements); //Called the function to display movements of account1

// Function to calculate the balance of an account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `€${acc.balance}`;
};
//calcDisplayBalance(account1.movements); //Called the function.

// Functions to calculate the summary of deposits, withdrawals and interest earned respectively
const calcDisplaySummary = function (acc) {
  // Calculate total deposits
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `€${income}`;

  // Calculate total withdrawals
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `€${Math.abs(out)}`;

  // Calculate interest earned from deposits
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `€${interest.toFixed(2)}`;
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
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary(income, withdrawals and interest earned)
  calcDisplaySummary(acc);
};

//Event handlers for login, transfer, loan and close account respectively
let currentAccount; // Variable to store the currently logged-in account

/* Login event handler
 This function handles the login process when the user clicks the login button */
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form submission
 // console.log('Login button clicked'); // Log to console for debugging


  // Find the account that matches the username and pin
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.toUpperCase());// Convert input to uppercase to match the username format

  // If account is found, display welcome message and movements
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1; // Show the app

    inputLoginUsername.value = inputLoginPin.value = ''; // Clear input fields
    inputLoginPin.blur(); // Remove focus from pin input

    console.log(`Logged in as: ${currentAccount.owner}`); // Log the logged-in account

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
  const amount = Number(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value.toUpperCase()
  );
  console.log(amount, receiverAccount); // Log transfer details for debugging
  
//Afterwards, clear the input fields
  inputTransferAmount.value = inputTransferTo.value = ''; // Clear input fields
  inputTransferAmount.blur(); // Remove focus from transfer amount input
  // Check if the transfer is valid
  if (
    amount > 0 && // Checking if the amount is positive
    receiverAccount && // Checking if the receiver account exists
    currentAccount.balance >= amount && // Checking if the current account has enough balance
    receiverAccount?.username !== currentAccount.username // Checking if the receiver account is not the same as the current account
  ) {
    // Perform the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    console.log('Transfer succesful'); // Log transfer details

    // Update UI after transfer
    updateUI(currentAccount);
  } else {
    //create a message to inform the user that the transfer failed
    labelWelcome.textContent = 'Transfer failed. Please check the amount and recipient.';
    labelWelcome.style.color = 'red'; // Change text color to red

    //reset the labelWelcome after 3 seconds
    setTimeout(() => {
      labelWelcome.textContent = `Welcome back, Mr. ${currentAccount.owner.split(' ')[0]}`;
      labelWelcome.style.color = ''; // Reset text color
    //console.log('Transfer failed. Please check the amount and recipient.'); // Log transfer failure
  }, 3000); // Reset after 3 seconds
  } 
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
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
////////////////////// Testing areas for better Understanding//////////////////////
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
console.log(account); // Output: Account object for Babari */