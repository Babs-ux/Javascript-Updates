'use strict';

const btn = document.querySelector('.btn-country');

// The container where country information will be displayed
const countriesContainer = document.querySelector('.countries');

// Function to fetch country data based on the country code
const renderCountry = function (data, className = '') {

  // HTML structure for displaying the country information
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html); // Insert the HTML into the container
  countriesContainer.style.opacity = 1; // Making the container visible
};

//Function to display error messages in the UI
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

//Wrapper function for fetching data from API (also includes error handling)
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) 
      // If response is not ok (status not in 200-299 range), throw an error
      throw new Error(`${errorMsg} (${response.status})`);
  // If successful, parse and return the JSON data
    return response.json();
  });
};

// Function to  wait for a specified number of seconds. returns a Promise that resolves after the specified time.
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const imgContainer = document.querySelector('.images');

// Function to create an image element and append it to the imgContainer
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

//Function to display current location of user using reverse geocoding
const whereAmI = function (lat, lng) {
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryCode}`);

      return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} . Please try again!`));
};

whereAmI(52.508, 13.381); // Example coordinates for Berlin

// Event listener for the button to get the user's current location
btn.addEventListener('click', function () {
  // Get the current position of the user
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      whereAmI(lat, lng); // Call the function with the user's coordinates
    },
    err => {
      console.error(err);
      renderError(`Unable to retrieve your location: ${err.message}`);
    }
  );
  btn.style.display = 'none'; // Hide the button after clicking
  countriesContainer.style.opacity = 0; // Hide the countries container initially
});