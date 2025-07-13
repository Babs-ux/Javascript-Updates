import icons from 'url:../../img/icons.svg'; // Importing icons

export default class View {
      _data;
      // Method to render the recipe
      render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
        return this.renderError(); // Render error if no data is provided
        }

        this._data = data; // Insert the generated markup into the parent element
        const markup = this._generateMarkup(); // Generate the HTML markup for the recipe

        if (!render) return markup; // If render is false, return the markup without inserting it into the DOM

        this._clear(); // Clear previous content 
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }
    
      // Method to update the recipe without re-rendering the entire view
      update(data) {
        this._data = data; 
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup); // Create a new DOM fragment from the generated markup
        const newElements = Array.from(newDOM.querySelectorAll('*')); // Select all elements in the new DOM fragment
        const curElements = Array.from(this._parentElement.querySelectorAll('*')); // Select all

        newElements.forEach((newEl, i ) => {
          const curEl = curElements[i]; // Get the corresponding element in the current DOM
          
          // Update changed text content
          if (
            !newEl.isEqualNode(curEl) && 
            newEl.firstChild?.nodeValue.trim() !== ''
          ) {
            curEl.textContent = newEl.textContent; // Update text content if it has changed
          }

          // Update changed attributes
          if (!newEl.isEqualNode(curEl)) {
            Array.from(newEl.attributes).forEach(attr => {
              curEl.setAttribute(attr.name, attr.value); // Update attributes if they have changed
            });
          }
        })
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

    renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}