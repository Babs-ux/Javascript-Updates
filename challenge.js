'use strict';

//Tip Calculator
const calcTip = function (bill) {
  return bill >= 50 && bill <= 300 ? bill * 0.15 : bill * 0.2;
}

// Example bills arrayBills array to store 10 test values
const bills = [22, 295, 176, 440, 37, 105, 10, 1100, 86, 52];

// empty arrays to store tips and totals
const tips = [];
const totals = [];

// Loop through each bill, calculate the tip and total, and store them in their respective arrays
for (let i = 0; i < bills.length; i++) {
    const tip = calcTip(bills[i]);
    tips.push(tip);
    totals.push(bills[i] + tip);
}

console.log(bills, tips, totals);

//BONUS CHALLENGE: Calculate the average of all tips and totals

// Function to calculate the average of all values in a given array
const calcAverage = function (arr) {
   let sum = 0; 
    for (let i = 0; i < arr.length; i++) {
       // sum = sum += arr[i]; (Another way to write the same line)
        // sum += arr[i]; (This is the preferred way)
       sum += arr[i];
    }
    
    return sum / arr.length;
}

console.log(calcAverage([2, 3, 7]));

console.log(calcAverage(totals));

console.log(calcAverage(tips));