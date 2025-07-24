import View from './View.js';
import preView from './preView.js';
import icons from 'url:../../img/icons.svg'; // Importing icons


class ResultsView extends View{
    _parentElement = document.querySelector('.results'); // The parent element where the search results will be rendered
    _errorMessage = 'No recipes found. Please try again!'; // Error message for when no recipes are found
    _message = ''; // Message to display after successful actions
    
    /// Method to generate the HTML markup for the search results
        _generateMarkup() {
            return this._data
            .map(result => preView.render(result, false))
            .join(''); // Map through the data and generate markup for each recipe
        }
}

export default new ResultsView(); // Exporting an instance of ResultsView