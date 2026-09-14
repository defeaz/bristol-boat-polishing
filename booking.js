const boatBookingForm = document.querySelector('#booking-form');
const boatBookingFields = document.querySelector('#boat-booking-fields');
const boatBookingStatus = document.querySelector('#booking-status');
const boatService = document.querySelector('#booking-service');
const regularFrequency = document.querySelector('#regular-frequency');
const frequencySelect = regularFrequency.querySelector('select');

function validUkPostcode(postcode) {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(postcode);
}

function resetDates() {
  boatBookingFields.hidden = true;
  document.querySelector('#boat-date').innerHTML = '';
}

function updateArrangement() {
  const regular = boatService.value === 'boat-regular';
  regularFrequency.hidden = !regular;
  frequencySelect.disabled = !regular;
  resetDates();
}

boatBookingForm
  .querySelectorAll('[name="postcode"], [name="service"]')
  .forEach((field) => field.addEventListener('change', resetDates));

boatService.addEventListener('change', updateArrangement);

document
  .querySelector('#find-boat-dates')
  .addEventListener('click', async () => {
    const postcode = boatBookingForm.postcode.value.trim().toUpperCase();
    const service = boatService.value;

    resetDates();

    if (!validUkPostcode(postcode)) {
      boatBookingStatus.textContent = 'Please enter a complete UK postcode.';
      return;
    }

    boatBookingStatus.textContent = 'Checking nearby availability…';

    try {
      const params = new URLSearchParams({ postcode, service });
      const response = await fetch(`/api/availability?${params}`);
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
    const response = await fetch('/api/create-booking', {
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
