'use strict';

// Months Array for formatting workout descriptions
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Base Workout Class
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const month = this.date.getMonth();
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[month]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const resetBtn = document.querySelector('.btn--reset');

class App {
  #map;
  #mapZoom = 13;
  #mapEvent;
  #workouts = [];
  #markers = [];

  constructor() {
    this._getPosition();
    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._handleWorkoutActions.bind(this));

    document.addEventListener('keydown', e => {
      if (e.key === 'r' || e.key === 'R') this.reset();
    });

    resetBtn?.addEventListener('click', this.reset.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    form.style.display = 'none';
    setTimeout(() => (form.style.display = 'grid'), 1500);
    form.classList.add('hidden');
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.value = inputElevation.value = '';
  }

  _newWorkout(e) {
    e.preventDefault();
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
        return alert('Please enter positive numbers!');
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
        return alert('Please enter positive numbers!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
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

    this.#markers.push({ id: workout.id, marker });
  }

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

  _handleWorkoutActions(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);

    if (e.target.classList.contains('btn--delete')) {
      this.#workouts = this.#workouts.filter(w => w.id !== workout.id);
      workoutEl.remove();

      const markerObj = this.#markers.find(m => m.id === workout.id);
      if (markerObj) {
        this.#map.removeLayer(markerObj.marker);
        this.#markers = this.#markers.filter(m => m.id !== workout.id);
      }

      this._setLocalStorage();
      return;
    }

    if (e.target.classList.contains('btn--edit')) {
      this.#mapEvent = { latlng: { lat: workout.coords[0], lng: workout.coords[1] } };
      form.classList.remove('hidden');

      //Set form inputs with workout data
      inputDistance.focus();
      inputType.value = workout.type;
      inputDistance.value = workout.distance;
      inputDuration.value = workout.duration;

      //If workout type is running, show cadence input, otherwise show elevation input
      if (workout.type === 'running') {
        inputCadence.value = workout.cadence;
        inputElevation.value = '';
      } else {
        inputElevation.value = workout.elevationGain;
        inputCadence.value = '';
      }
      this.#workouts = this.#workouts.filter(w => w.id !== workout.id);
      workoutEl.remove();

      const markerObj = this.#markers.find(m => m.id === workout.id);
      if (markerObj) {
        this.#map.removeLayer(markerObj.marker);
        this.#markers = this.#markers.filter(m => m.id !== workout.id);
      }

      this._setLocalStorage();
    }
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data.map(work => {
      if (work.type === 'running') return Object.assign(new Running([], 0, 0, 0), work);
      if (work.type === 'cycling') return Object.assign(new Cycling([], 0, 0, 0), work);
      return work;
    });

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
      this._renderWorkoutMarker(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
