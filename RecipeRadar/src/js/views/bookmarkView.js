import View from './View.js';
import preView from './preView.js';
import icons from 'url:../../img/icons.svg'; // Importing icons


class BookmarksView extends View{
    _parentElement = document.querySelector('.bookmarks__list'); // The parent element where the search results will be rendered
    _errorMessage = 'No bokmarks yet. Find a delicious recipe!'; // Error message for when no recipes are found
    _message = ''; // Message to display after successful actions
    
    // Method to add a click handler for the bookmarks
    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    // Method to generate the HTML markup for the search results
    _generateMarkup() {
        return this._data
        .map(bookmark => preView.render(bookmark, false))
        .join(''); // Map through the data and generate markup for each recipe
    }
    
}

export default new BookmarksView(); // Exporting an instance of ResultsView