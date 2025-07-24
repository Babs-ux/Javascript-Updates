import * as model from './model.js'; // Importing the model
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'; // Importing the recipe view
import renderSpinner from './views/recipeView.js'; // Importing the spinner view

import searchView from './views/searchView.js';
import addREcipeView from './views/addREcipeView.js';
import resultsView from './views/resultsView.js'; // Importing the results view
import bookmarksView from './views/bookmarkView.js'; // Importing the bookmarks view

import pageView from './views/pageView.js'; // Importing the pagination view

import 'core-js/stable'; // Polyfills for stable features
import 'regenerator-runtime/runtime'; // Polyfills for async/await
import { async } from 'regenerator-runtime';

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

    //Update the results view to mark the selected recipe
    resultsView.update(model.getSearchResultsPage()); // Update the results view with the current search results
    bookmarksView.update(model.state.bookmarks); // Update the bookmarks view with the current bookmarks
    
    //Loading the recipe
    await model.loadRecipe(id); // Call the loadRecipe function from the model

    // Rendering the recipe to the DOM (for HTML)
    recipeView.render(model.state.recipe);
    

  } catch (err) {
   //console.log(err);
   recipeView.renderError(`${err} gbum`); // Render error message if something goes wrong 
  }
};

// Function to control the searcg results. this function is called when the user submits a search query.
const controlResults = async function () {
  try {
    resultsView.renderSpinner(); // Show spinner while loading results

    const query = searchView.getQuery(); // Get the search query from the search view
    if (!query) return; // If no query, exit the function

    // Load the search results
    await model.loadResults(query);
    
    resultsView.render(model.getSearchResultsPage()); // Render the search results to the DOM
    pageView.render(model.state.search); // Render the pagination
  } catch (err) {
    console.log(err);
  }
};


// This function is called when the user clicks on a pagination button.
const controlPage = function (goToPage) {
  // Update the current page in the model
  model.getSearchResultsPage(goToPage);
  
  // Render the new results and pagination
  resultsView.render(model.getSearchResultsPage(goToPage));
  pageView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the servings in the model
  model.updateServings(newServings);

  // Re-render the recipe view with the updated servings
  recipeView.update(model.state.recipe);
}

const controlBookmarks = function () {
  // Add or remove the recipe from bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe); 
  else model.deleteBookmark(model.state.recipe.id); 

  //Update the recipe view to reflect the changes
  recipeView.update(model.state.recipe); // Update the recipe view to reflect the changes

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks); // Render the bookmarks view with the updated bookmarks
}

const controlBookamrks = function () {
  // Render the bookmarks view when the page loads
  bookmarksView.render(model.state.bookmarks); // Render the bookmarks view with the current bookmarks
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner while adding the recipe
    addREcipeView.renderSpinner();

    // Upload the new recipe
    await model.uploadRecipe(newRecipe);

    // Render the new recipe
    recipeView.render(model.state.recipe);

    //Close form window
    setTimeout(function() {
      addREcipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

    // Success message
    addREcipeView.renderMessage();

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change the URL to the new recipe ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

  } catch (err) {
    console.error(err);
    addREcipeView.renderError(err.message); // Render error message if something goes wrong
  }
};

// Function to initialize the application
const init = function () {
  bookmarksView.addHandlerRender(controlBookamrks); // Add event listener for rendering bookmarks on page load
  recipeView.addHandlerRender(controlRecipes); // Add event listeners for hashchange and load events

  recipeView.addHandlerUpdateServings(controlServings); // Add event listener for servings update
  recipeView.addHandlerAddBookmark(controlBookmarks); // Add event listener for adding bookmarks

  searchView.addHandlerSearch(controlResults); // Add event listener for search submission
  pageView.addHandlerClick(controlPage); // Add event listener for pagination button clicks

  addREcipeView.addHandlerUpload(controlAddRecipe);
};

init(); // Initialize the application

