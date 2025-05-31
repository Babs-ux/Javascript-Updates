//Challenge to make a very simple tip calculator for whenever "Steve" goes out to eat with his friends.


//Created a variable for the bill amount.
const bill = 275;

//Created a variable for the tip amount based on the bill amount. 
// If the bill is between 50 and 300, the tip is 15%, otherwise it is 20%.
const tip = bill <= 300 && bill >= 50 ? bill * 0.15 : bill * 0.2;

console.log(`The bill was ${bill}, the tip was ${tip}, and the total value is ${bill + tip}.`);