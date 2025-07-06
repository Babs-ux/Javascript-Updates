'use strict';

// Months Array for formatting workout descriptions
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Base Workout Class
class Workout {
  date = new Date(); // Workout date
  id = (Date.now() + '').slice(-10); // Unique ID based on timestamp
  clicks = 0; // Counter for marker clicks

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  // Set description based on workout type and date
  _setDescription() {
    const month = this.date.getMonth();
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[month]} ${this.date.getDate()}`;
  }

  // Increment click count
  click() {
    this.clicks++;
  }
}

// Running Workout Class
class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence; // in steps/min
    this.calcPace(); // Calculate pace
    this._setDescription(); // Set description
  }

  calcPace() {
    this.pace = this.duration / this.distance; // min/km
    return this.pace;
  }
}

// Cycling Workout Class
class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain; // in meters
    this.calcSpeed(); // Calculate speed
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // km/h
    return this.speed;
  }
}

// Selecting DOM Elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Main Application Class
class App {
  #map;
  #mapZoom = 13; // Default map zoom
  #mapEvent;
  #workouts = []; // Array to hold workouts

  constructor() {
    this._getPosition(); // Get user location
    this._getLocalStorage(); // Load workouts from local storage

    // Event Listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._handleWorkoutActions.bind(this));

    // Shortcut to reset workouts with 'R' key
    document.addEventListener('keydown', e => {
      if (e.key === 'r' || e.key === 'R') this.reset();
    });
  }

  // Get user's current position
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  // Load map centered on user's location
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.#map);

    // Listen for map clicks to add new workout
    this.#map.on('click', this._showForm.bind(this));

    // Render existing workouts from local storage
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
      this._renderWorkoutMarker(work);
    });
  }

  // Show the input form when map is clicked
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  // Hide and reset the form
  _hideForm() {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    form.style.display = 'none';
    setTimeout(() => (form.style.display = 'grid'), 1500);
    form.classList.add('hidden');
  }

  // Toggle visibility of cadence and elevation fields
  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.value = inputElevation.value = '';
  }

  // Handle new workout creation
  _newWorkout(e) {
    e.preventDefault();
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Create Running Workout
    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
        return alert('Please enter positive numbers!');
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // Create Cycling Workout
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
        return alert('Please enter positive numbers!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add to workouts array and render
    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }

  // Render marker for workout
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`
      }))
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴'} ${workout.description}`)
      .openPopup();
  }

  // Render workout in sidebar list with Edit & Delete buttons
  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>`;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>`;

    html += `
      <div class="workout__actions">
        <button class="btn btn--edit"><i class="ri-edit-line"></i></button>
        <button class="btn btn--delete"><i class="ri-close-circle-line"></i></button>
      </div>
      </li>`;

    form.insertAdjacentHTML('afterend', html);
  }

  // Handle edit & delete button clicks
  _handleWorkoutActions(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);

    // Delete workout
    if (e.target.classList.contains('btn--delete')) {
      this.#workouts = this.#workouts.filter(w => w.id !== workout.id);
      workoutEl.remove();
      this._setLocalStorage();
      return;
    }

    // Edit workout - pre-fill form and remove old workout
    if (e.target.classList.contains('btn--edit')) {
      this.#mapEvent = { latlng: { lat: workout.coords[0], lng: workout.coords[1] } };
      form.classList.remove('hidden');
      inputDistance.focus();
      inputType.value = workout.type;
      inputDistance.value = workout.distance;
      inputDuration.value = workout.duration;


      if (workout.type === 'running') {
        inputCadence.value = workout.cadence;
        inputElevation.value = '';
      } else {
        inputElevation.value = workout.elevationGain;
        inputCadence.value = '';
      }
      this.#workouts = this.#workouts.filter(w => w.id !== workout.id);
      workoutEl.remove();
      this._setLocalStorage();
    }
  }

  // Save workouts to local storage
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // Load workouts from local storage, restoring class instances
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data.map(work => {
      if (work.type === 'running') return Object.assign(new Running([], 0, 0, 0), work);
      if (work.type === 'cycling') return Object.assign(new Cycling([], 0, 0, 0), work);
      return work;
    });

    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  // Clear all workouts and reload app
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

// Initialize app
const app = new App();
