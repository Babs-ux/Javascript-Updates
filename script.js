/*
Challenge to make a function that recieves daily work hours for a certain week
and returns:
Total hours worked, average hours per day, and the day with the most hours worked, number of days worked
Whether the week was full time (35 hours or more)
*/

'use strict';

function analyzeWorkWeek(dailyHours) {
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  //must be array of 7 numbers if not there will be Error
  if (
    !Array.isArray(dailyHours) ||
    dailyHours.length !== 7 ||
    !dailyHours.every(h => typeof h === 'number' && h >= 0)
  ) {
    throw new Error('Input must be an array of exactly 7 non-negative numbers representing daily work hours.');
  }

  //Calculate total and average hours
  const totalRaw = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const averageRaw = totalRaw / dailyHours.length;

  // Convert decimal hours to minutes
  function formatHoursAndMinutes(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours} hours ${minutes} minutes`;
  }

  const totalHours = formatHoursAndMinutes(totalRaw);
  const averageHours = formatHoursAndMinutes(averageRaw);

  // Find the day with the most hours worked
  let maxHours = -1;
  let maxDayIndex = -1;
  for (let i = 0; i < dailyHours.length; i++) {
    if (dailyHours[i] > maxHours && dailyHours[i] > 0) {
      maxHours = dailyHours[i];
      maxDayIndex = i;
    }
  }
  const maxDay = maxDayIndex !== -1 ? daysOfWeek[maxDayIndex] : null;

  //  Count days worked and determine if full-time
  const daysWorked = dailyHours.filter(hours => hours > 0).length;
  const isFullTime = totalRaw >= 35;

  return {
    totalHours,
    averageHours,
    maxDay,
    daysWorked,
    isFullTime,
  };
}

//Example
const weeklyHours = [7.5, 8, 6.5, 0, 8.5, 5, 0];
const analysis = analyzeWorkWeek(weeklyHours);
console.log(analysis);

//Another example, but to display the error handling
const weeklyHours2 = [7.5, 8, 6.5, 0, 8.5];
const analysis2 = analyzeWorkWeek(weeklyHours2);
console.log(analysis2);
