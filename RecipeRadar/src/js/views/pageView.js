import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Importing icons


class PageView extends View{
    _parentElement = document.querySelector('.pagination');

     addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline'); // Get the closest button element

            const goToPage = +btn.dataset.goto; // Get the page number from the button's data attribute
            if (!btn) return; // If no button is clicked, exit the function
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const currentPage = this._data.page; // Get the current page from the data
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); // Calculate the total number of pages

        // If there is only one page, return an empty string
        if (numPages === 1) return '';

        // Generate markup for the pagination buttons

        // If the user is on the first page, only show the next button if there are more pages
        if (currentPage === 1 && numPages > 1) {
        return `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next" ${currentPage === numPages ? 'disabled' : ''}>
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
        }

        // If the user is on the last page, only show the previous button
        if (currentPage === numPages && numPages > 1) {
            return `
                <button data-goto=" ${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `;
        }

        //If the user is in the middle of the pages, show the previous and next buttons
        if (currentPage < numPages) {
            return `
                <button data-goto=" ${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>

                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next" ${currentPage === numPages ? 'disabled' : ''}>
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
    }
}

export default new PageView(); // Exporting an instance of PageView

/* Note for later:
Refactor the buttons. I think by creating a _generateMarkupbtn method */