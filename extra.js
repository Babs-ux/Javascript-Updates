
'use strict';

/* 
Writing a program that receives a list of variable names written in underscore_case and converts them to camelCase.


THIS TEST DATA (pasted to textarea)
underscore_case
 first_name
Some_Variable 
  calculate_AGE
delayed_departure

SHOULD PRODUCE THIS OUTPUT (5 separate console.log outputs)
underscoreCase      
firstName           
someVariable        
calculateAge        
delayedDeparture    
*/
 

// Created a textarea and a button in the document for user input
document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

/* Adding a click event listener to the button
 When the button is clicked, it reads the text from the textarea */
document.querySelector('button').addEventListener('click', function () {
  const text = document.querySelector('textarea').value;
  const rows = text.split('\n');

  /* Loop through each row, convert it to camelCase, and log the output
   Using padEnd to align the output for better readability */
  for (const [i, row] of rows.entries()) {
    const [first, second] = row.toLowerCase().trim().split('_');

    const output = `${first}${second.replace(
      second[0],
      second[0].toUpperCase()
    )}`;
    console.log(`${output.padEnd(20)}${''.repeat(i + 1)}`);
  }
});