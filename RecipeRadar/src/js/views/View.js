import icons from 'url:../../img/icons.svg'; // Importing icons

export default class View {
      _data;
      // Method to render the recipe
      render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
        return this.renderError(); // Render error if no data is provided
        }

        this._data = data; // Insert the generated markup into the parent element
        const markup = this._generateMarkup(); // Generate the HTML markup for the recipe
        this._clear(); // Clear previous content 
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }
    
      _clear() {
        this._parentElement.innerHTML = ''; // Clear the parent element
      }
    
      //Spinner
      renderSpinner = function () {
      const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
      this._clear(); // Clear previous content
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }
    
      renderError(message = this._errorMessage) {
        const markup = `
         <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
        this._clear(); // Clear previous content
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }
}