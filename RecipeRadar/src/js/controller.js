import * as model from './model.js'; // Importing the model
import recipeView from './views/recipeView.js'; // Importing the recipe view
import renderSpinner from './views/recipeView.js'; // Importing the spinner view
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js'; // Importing the results view

import 'core-js/stable'; // Polyfills for stable features
import 'regenerator-runtime/runtime'; // Polyfills for async/await

if(module.hot) {
  module.hot.accept(); // Accept hot module replacement so that changes in the code can be reflected without a full reload
}

// Fetching a recipe from the Forkify API
const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1); // Get the recipe ID from the URL hash
    // console.log(id);

    if (!id) return; // If no ID, exit the function
    recipeView.renderSpinner(); // Show spinner while loading

    //Loading the recipe
    await model.loadRecipe(id); // Call the loadRecipe function from the model

    // Rendering the recipe to the DOM (for HTML)
    recipeView.render(model.state.recipe);
  } catch (err) {
   //console.log(err);
   recipeView.renderError(`${err} gbum`); // Render error message if something goes wrong 
  }
};

const controlResults = async function () {
  try {
    resultsView.renderSpinner(); // Show spinner while loading results

    const query = searchView.getQuery(); // Get the search query from the search view
    if (!query) return; // If no query, exit the function

    await model.loadResults(query);
    
    resultsView.render(model.state.search.results); // Render the search results to the DOM
  } catch (err) {
    console.log(err);
  }
};


const init = function () {
  recipeView.addHandlerRender(controlRecipes); // Add event listeners for hashchange and load events
  searchView.addHandlerSearch(controlResults); // Add event listener for search submission
};

init(); // Initialize the application

