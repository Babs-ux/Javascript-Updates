/*1. Create an array 'events' of the different game events that happened (no duplicates)
2. After the game has finished, is was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.
3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
      [FIRST HALF] 17: ⚽️ GOAL


*/
'use strict';

const gameEvents = new Map([
  [17, '⚽️ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽️ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽️ GOAL'],
  [80, '⚽️ GOAL'],
  [92, '🔶 Yellow card'],
]);

//1. creating the Events array from the gameEvents map
const events = [...new Set(gameEvents.values())];
//crosschecking if it's an array
console.log(events);

//2. removing the unfair yellow card event
gameEvents.delete(64);

//3. calculating the average time between events
console.log(`An event happened, on average, every ${90 / gameEvents.size} minutes`);
//logging the last event in the match to the console
const time = [...gameEvents.keys()].pop();
console.log(`and the last event happened at ${time} minutes`);

//4. looping over the events and logging them to the console
for (const [key, value] of gameEvents) {
  const half = key <= 45 ? 'FIRST HALF' : 'SECOND HALF';
  console.log(`[${half}] ${key}: ${value}`);
}