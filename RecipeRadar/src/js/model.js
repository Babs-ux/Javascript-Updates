import { async } from 'regenerator-runtime'; // Importing async functionality
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJSOn, sendJSOn } from './helpers.js'; // Importing helper function to fetch JSON data



export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // by default, it should be the first page
    resultsPerPage: RES_PER_PAGE, // Number of results per page
  },
  bookmarks: [],  
};  

const createRecipe = function (data) {
  let { recipe } = data.data;

    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }), 
    };
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJSOn(`${API_URL}/${id}`); 
    state.recipe = createRecipe(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      recipe.bookmarked = true; // If the recipe is bookmarked, set the bookmarked property to true
    } else {
      state.recipe.bookmarked = false; // Otherwise, set it to false  
    }  

    state.recipe = recipe; // Store the recipe in the state
  } catch (err) {
    console.log( `${err} gbum`); // Propagate the error
    throw err;
  }
};

//API call to fetch recipe data
export const loadResults = async function (query) {
  try {
    state.search.query = query; // Set the search query in the state
    const data = await getJSOn(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
       // ...(rec.key && { key: rec.key }), // Optional chaining to include key if it exists
      };
    });
    state.search.page = 1; // Reset the page to 1 after a new search
    // console.log(state.search.results); // Log the search results
  }catch (err) {
    console.log( `${err} gbum`); // Propagate the error
    throw err;
  }
}
// loadResults('pizza'); // Example call to load recipes with 'pizza' as the search query

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // Set the current page in the state

  const start = (page - 1) * state.search.resultsPerPage; // Calculate the start index for pagination
  const end = page * state.search.resultsPerPage;;

  return state.search.results.slice(start, end);
}

//function to update the recipe(ingredients especially) each time the button is clicked
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // Update the quantity of each ingredient based on the new servings
  });

  state.recipe.servings = newServings; // Update the servings in the recipe
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // Save the bookmarks 
}  

//Function to add recipes to bookmarks
export const addBookmark = function (recipe) {
  // Add a recipe to the bookmarks
  state.bookmarks.push(recipe); // Add the recipe to the bookmarks array

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true; // Set the bookmarked property to true for the current recipe
  }

  persistBookmarks();
}

//Function to delete a recipe from bookmarks
export const deleteBookmark = function (id) {
  // Delete a recipe from the bookmarks
  const index = state.bookmarks.findIndex(el => el.id === id); // Find the index of the recipe to be deleted
  state.bookmarks.splice(index, 1); // Remove the recipe from the bookmarks array

  // Mark the current recipe as not bookmarked if it was deleted
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false; // Set the bookmarked property to false for the current recipe
  }

  persistBookmarks();
};

const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // Load bookmarks from local storage if they exist 
}
init();

// Function to clear bookmarks from local storage for debugging
const clearBookmarks = function () {
  localStorage.clear('bookmarks'); // Clear bookmarks from local storage
  state.bookmarks = []; // Reset the bookmarks array in the state
}
//clearBookmarks();


// This function takes a new recipe object as an argument and uploads it to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe) // Convert the new recipe object to an array of entries
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') // Filter out empty ingredients
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format: "Quantity, Unit, Description"'); // Validate the ingredient format
      const [quantity, unit, description] = ingArr; // Destructure the ingredient array into quantity, unit, and description
      return {quantity: quantity ? +quantity : null, unit, description}; // Return an object with quantity, unit, and description

    });
    const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime, // Convert cooking time to a number
    servings: +newRecipe.servings, // Convert servings to a number
    ingredients, // Include the ingredients array
  };
  console.log(recipe);
  const data = await sendJSOn(`${API_URL}?key=${KEY}`, recipe)
  state.recipe = createRecipe(data);
  addBookmark(state.recipe);
  } catch (err) {
    throw err; // Propagate the error if the ingredient format is incorrect
  }
  
}