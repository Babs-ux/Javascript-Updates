//Task to store BMI data of Mark and John in variables, calculate their BMI and log the valuese in console

const massMark = 78; // kg
const heightMark = 1.69; // m
const massJohn = 92; // kg
const heightJohn = 1.95; // m

const BMIMark = massMark / (heightMark * heightMark);
const BMIJohn = massJohn / (heightJohn * heightJohn);
console.log(BMIMark, BMIJohn);

//New task: comparing the BMIs of Mark and John and logging the result in console

if( BMIMark > BMIJohn ) {
    console.log(`Mark's BMI (${BMIMark}) is higher than John's (${BMIJohn})!`);
}else {
    console.log(`John's BMI (${BMIJohn}) is higher than Mark's (${BMIMark})!`);
}

