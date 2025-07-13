import { async } from 'regenerator-runtime'; // Importing async functionality
import { API_URL } from './config';
import { getJSOn } from './helpers.js'; // Importing helper function to fetch JSON data


export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },  
};  

export const loadRecipe = async function (id) {
  try {
    const data = await getJSOn(`${API_URL}/${id}`); 
    let { recipe } = data.data;

    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

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
    console.log(state.search.results); // Log the search results
  }catch (err) {
    console.log( `${err} gbum`); // Propagate the error
    throw err;
  }
}
// loadResults('pizza'); // Example call to load recipes with 'pizza' as the search query