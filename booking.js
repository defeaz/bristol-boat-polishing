const boatBookingForm = document.querySelector('#booking-form');
const boatBookingFields = document.querySelector('#boat-booking-fields');
const boatBookingStatus = document.querySelector('#booking-status');
const boatService = document.querySelector('#booking-service');
const regularFrequency = document.querySelector('#regular-frequency');
const frequencySelect = regularFrequency.querySelector('select');
const bookingApi = 'https://caravanrevival.com/api';
const boatLength = document.querySelector('#boat-length');
const boatLengthOutput = document.querySelector('#boat-length-output');
const classicBoat = document.querySelector('#classic-boat-size');

function updateBoatLength() {
  const feet = Number(boatLength.value);
  const scale = 18 + ((feet - 10) / 90) * 82;
  boatLengthOutput.textContent = `${feet} ft`;
  classicBoat.style.width = `${scale}%`;
}

function resetDates() {
  boatBookingFields.hidden = true;
  document.querySelector('#boat-date').innerHTML = '';
}

function updateArrangement() {
  const regular = boatService.value === 'boat-regular';
  regularFrequency.style.display = regular ? 'flex' : 'none';
  frequencySelect.disabled = !regular;
  resetDates();
}

boatBookingForm
  .querySelectorAll('[name="locationQuery"], [name="service"]')
  .forEach((field) => field.addEventListener('change', resetDates));

boatService.addEventListener('change', updateArrangement);
boatLength.addEventListener('input', updateBoatLength);
updateArrangement();
updateBoatLength();

document
  .querySelector('#find-boat-dates')
  .addEventListener('click', async () => {
    const location = boatBookingForm.locationQuery.value.trim();
    const service = boatService.value;

    resetDates();

    if (location.length < 3) {
      boatBookingStatus.textContent = 'Please enter a marina name or complete postcode.';
      return;
    }

    boatBookingStatus.textContent = 'Checking nearby availability…';

    try {
      const params = new URLSearchParams({ location, service });
      const response = await fetch(`${bookingApi}/availability?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to check availability.');
      }

      if (!data.dates.length) {
        throw new Error(
          'There are no suitable nearby dates available at present. Please send an enquiry.'
        );
      }

      document.querySelector('#boat-date').innerHTML = data.dates
        .map((date) => `<option value="${date.value}">${date.label}</option>`)
        .join('');

      boatBookingFields.hidden = false;
      boatBookingStatus.textContent = '';
    } catch (error) {
      boatBookingStatus.textContent = error.message;
    }
  });

boatBookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  boatBookingStatus.textContent = 'Taking you to secure payment…';

  const payload = Object.fromEntries(new FormData(boatBookingForm));

  try {
    const response = await fetch(`${bookingApi}/create-booking`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to complete the booking.');
    }

    window.location.href = data.url;
  } catch (error) {
    boatBookingStatus.textContent =
      error.message || 'Unable to complete the booking. Please try again.';
  }
});
