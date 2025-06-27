'use strict';

// This code is a simple poll application that allows users to vote for their favorite programming language.
const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates an array of 4 elements, each initialized to 0
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    // Get answer
    const answer = Number(
      prompt(
        `${this.question}\n${this.options.join('\n')}\n(Write option number)`
      )
    );
    console.log(answer);

    // Register answer
    typeof answer === 'number' &&
      answer < this.answers.length &&
      this.answers[answer]++;
    // Display results
    this.displayResults();
    this.displayResults('string');
  },

  // Display results in two formats: as an array and as a string
  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      // Convert the answers array to a string format
      console.log(`Poll results are ${this.answers.join(', ')}`);
    }
  },
};

// Adding a textarea and a button to the document for user input
document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));
  // Example calls to displayResults with different contexts
poll.displayResults.call({ answers: [5, 2, 3] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });
