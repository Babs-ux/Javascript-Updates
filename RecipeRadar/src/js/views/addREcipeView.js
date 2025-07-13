import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Importing icons


class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was uploaded successfuly!'

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow(); 
    }

    toggleWindow() {
        this._window.classList.toggle('hidden'); // Show the add recipe window
        this._overlay.classList.toggle('hidden'); // Show the overlay
    }

    // Method to render the add recipe form
    _addHandlerShowWindow() {
        console.log('Clicked')
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)); 
    }

    addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

    _generateMarkup() {}

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

export default new AddRecipeView(); // Exporting an instance of PageView

/* Note for later:
Refactor the buttons. I think by creating a _generateMarkupbtn method */