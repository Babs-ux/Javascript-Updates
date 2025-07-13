class SearchView {
  _parentElement = document.querySelector('.search');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  // Method to render the search results
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // Method to clear the input field after search
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

}

export default new SearchView();