//Challenge to make a football betting application



'use strict';

// Data for the football game
const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2020',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

// one player array for each team (variables 'players1' and 'players2')
const [players1, players2] = game.players;
console.log(players1, players2);

// players1 is Bayern, players2 is Dortmund. The first player of players1 is the goalkeeper
const [gk, ...fieldPlayers] = players1;
console.log(gk, fieldPlayers);

// Created an array 'allPlayers' containing all players of both teams
const allPlayers = [...players1, ...players2];
console.log(allPlayers);

// Created an array 'players1Final' containing all players of players1 and 3 substitutions
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];
console.log(players1Final);

//Odds for each output
const { odds: { team1, x: draw, team2 } } = game;
console.log(team1, draw, team2);

// 
team1 < team2 && console.log('Team 1 is more likely to win'); // Log if Team 1 has better odds (lower value)
team1 > team2 && console.log('Team 2 is more likely to win'); // Log if Team 2 has better

// Function to print the goals scored
const printGoals = function (...players) {
    console.log(players);
  console.log(`${players.length} goals were scored`);
};

//Test Data
printGoals(...game.scored);


