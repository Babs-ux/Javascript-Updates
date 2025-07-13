import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Importing icons


class ResultsView extends View{
    _parentElement = document.querySelector('.results'); // The parent element where the search results will be rendered
    _errorMessage = 'No recipes found. Please try again!'; // Error message for when no recipes are found
    _message = ''; // Message to display after successful actions
    
    // Method to generate the HTML markup for the search results
    _generateMarkup() {
        return this._data.map(this._generateMarkupPreview).join(''); // Map through the data and generate markup for each recipe
    }
    
    // Method to generate the markup for each recipe preview 
    _generateMarkupPreview(result) {
        return `
       <li class="preview">
            <a class="preview__link" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
            </a>
        </li>
       `;
    }
}

export default new ResultsView(); // Exporting an instance of ResultsView