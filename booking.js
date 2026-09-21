const boatBookingForm = document.querySelector('#booking-form');
const boatBookingFields = document.querySelector('#boat-booking-fields');
const boatBookingStatus = document.querySelector('#booking-status');
const boatService = document.querySelector('#booking-service');
const regularFrequency = document.querySelector('#regular-frequency');
const frequencySelect = regularFrequency.querySelector('select');
const bookingApi = window.BOOKING_API_URL;
const boatLength = document.querySelector('#boat-length');
const boatLengthOutput = document.querySelector('#boat-length-output');
const classicBoat = document.querySelector('#classic-boat-size');
const boatPrice = document.querySelector('#boat-price');
const boatType = document.querySelector('#boat-type');
const boatModelOptions = document.querySelector('#boat-model-options');
const boatModelExamples = document.querySelector('#boat-model-examples');
const motorBoatImages = [
  [19, 'boat-rib-10-19-v2.png'],
  [29, 'boat-sports-20-29-v2.png'],
  [44, 'boat-flybridge-30-44-v2.png'],
  [59, 'boat-cabin-cruiser-45-59-v3.png'],
  [79, 'boat-motor-yacht-60-79-v3.png'],
  [100, 'boat-superyacht-80-100-v3.png']
];
const sailingBoatImages = [
  [29, 'boat-sailing-20-29-v2.png'],
  [44, 'boat-sailing-30-44-v2.png'],
  [60, 'boat-sailing-45-60-v2.png'],
  [79, 'boat-sail-51-80.png'],
  [100, 'boat-sailing-yacht-80-100-v3.png']
];
const marinaPostcodes = {
  'bristol marina': 'BS1 6XQ',
  'bristol harbour': 'BS1 5UH',
  'bristol floating harbour': 'BS1 5UH',
  'portishead marina': 'BS20 7DF',
  'portavon marina': 'BS31 2DD',
  'keynsham marina': 'BS31 2DD',
  'saltford marina': 'BS31 3JS',
  'bath marina': 'BA2 1SQ',
  'devizes marina': 'SN10 1QR',
  'sharpness marina': 'GL13 9UN',
  'saul marina': 'GL2 7JY',
  'gloucester docks': 'GL1 2EH',
  'tewkesbury marina': 'GL20 5BY',
  'upton marina': 'WR8 0PB',
  'cardiff marina': 'CF11 0JL',
  'cardiff bay marina': 'CF10 4LY',
  'penarth marina': 'CF64 1TQ',
  'barry marina': 'CF62 5TQ',
  'chepstow marina': 'NP16 5HH'
};
const localBoatPrices = [
  [19, 95, 350, 1500], [29, 125, 425, 1750], [39, 155, 500, 2000],
  [49, 185, 600, 2400], [59, 225, 725, 2900], [69, 275, 875, 3500],
  [79, 340, 1050, 4200], [89, 420, 1250, 5000], [100, 520, 1500, 6000]
];

const popularBoatExamples = {
  Cruiser: [
    [20, ['Quicksilver Activ 555', 'Jeanneau Cap Camarat 5.5', 'Bayliner VR5']],
    [30, ['Jeanneau Merry Fisher 795', 'Beneteau Antares 8', 'Parker 800 Weekend']],
    [40, ['Princess V40', 'Sealine S390', 'Fairline Targa 40']],
    [50, ['Princess F45', 'Sealine F430', 'Sunseeker Manhattan 46']],
    [60, ['Princess F55', 'Sunseeker Manhattan 55', 'Fairline Squadron 58']],
    [80, ['Princess Y72', 'Sunseeker 76 Yacht', 'Fairline Squadron 68']],
    [100, ['Princess X95', 'Sunseeker 95 Yacht', 'Azimut Grande 27M']]
  ],
  Yacht: [
    [20, ['Beneteau First 18', 'Cornish Crabber 17', 'Drascombe Lugger']],
    [30, ['Beneteau Oceanis 30.1', 'Jeanneau Sun Odyssey 290', 'Hanse 315']],
    [40, ['Bavaria C38', 'Beneteau Oceanis 37.1', 'Jeanneau Sun Odyssey 380']],
    [50, ['Bavaria C46', 'Beneteau Oceanis 46.1', 'Jeanneau Sun Odyssey 490']],
    [60, ['Oyster 565', 'Hanse 588', 'Beneteau Oceanis Yacht 54']],
    [80, ['Oyster 675', 'Princess 72', 'Sunreef 70']],
    [100, ['Oyster 885', 'CNB 88', 'Sunreef 80']]
  ],
  'Motor yacht': [
    [30, ['Jeanneau Merry Fisher 895', 'Beneteau Antares 9', 'Nimbus T9']],
    [40, ['Princess V40', 'Sealine C390', 'Fairline Targa 40']],
    [50, ['Princess F45', 'Sunseeker Manhattan 46', 'Azimut 50']],
    [60, ['Princess F55', 'Sunseeker 55 Manhattan', 'Azimut 60']],
    [80, ['Princess Y72', 'Sunseeker 76 Yacht', 'Azimut 72']],
    [100, ['Princess X95', 'Sunseeker 95 Yacht', 'Azimut Grande 27M']]
  ],
  'Sports cruiser': [
    [30, ['Bayliner VR6', 'Sea Ray Sundancer 265', 'Jeanneau Leader 9']],
    [40, ['Princess V40', 'Fairline Targa 40', 'Sunseeker Superhawk 40']],
    [50, ['Princess V50', 'Sunseeker Predator 50', 'Fairline Targa 45']],
    [100, ['Princess V65', 'Sunseeker Predator 75', 'Fairline Targa 65']]
  ],
  RIB: [[30, ['Ribeye A600', 'Brig Eagle 8', 'Highfield Sport 760']], [100, ['Ribeye PRIME 821', 'Brig Eagle 10', 'Highfield Patrol 860']]],
  'Day boat': [[30, ['Jeanneau Cap Camarat 7.5', 'Beneteau Flyer 8', 'Axopar 25']], [100, ['Axopar 37', 'Nimbus T11', 'Jeanneau Cap Camarat 10.5']]],
  Narrowboat: [[40, ['Aqualine Canterbury', 'Colecraft narrowboat', 'Liverpool Boats cruiser stern']], [60, ['Aqualine Madison', 'Braidbar hybrid narrowboat', 'Tyler Wilson narrowboat']], [100, ['Traditional 70 ft narrowboat', 'Semi-traditional 70 ft narrowboat', 'Widebeam liveaboard']]],
  'Canal boat': [[40, ['Cruiser-stern narrowboat', 'Traditional narrowboat', 'Compact widebeam']], [60, ['Semi-traditional narrowboat', 'Aqualine widebeam', 'Dutch-style barge']], [100, ['Widebeam liveaboard', 'Dutch barge', 'Hotel narrowboat']]],
  'Other boat': [[100, ['Enter your make and model', 'Custom or classic vessel', 'Commercial or work boat']]]
};

function updateBoatExamples(feet) {
  const groups = popularBoatExamples[boatType.value] || popularBoatExamples['Other boat'];
  const examples = groups.find(([maximum]) => feet <= maximum)?.[1] || groups.at(-1)[1];
  boatModelOptions.innerHTML = examples.map((model) => `<option value="${model}"></option>`).join('');
  boatModelExamples.textContent = `Popular examples around this size: ${examples.join(' · ')}`;
}

function updateBoatLength() {
  const feet = Number(boatLength.value);
  const images = boatType.value === 'Yacht' ? sailingBoatImages : motorBoatImages;
  boatLengthOutput.textContent = `${feet} ft`;
  classicBoat.src = (images.find(([maximum]) => feet <= maximum) || images.at(-1))[1];
  boatLength.style.setProperty('--range-progress', `${((feet - 10) / 90) * 100}%`);
  updateBoatExamples(feet);
}

function resetDates() {
  boatBookingFields.hidden = true;
  boatPrice.hidden = true;
  document.querySelector('#boat-date').innerHTML = '';
}

function money(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(value);
}

function showQuote(quote) {
  if (!quote || typeof quote.total !== 'number') {
    throw new Error(
      'Pricing is not available yet. Please deploy the updated Caravan Revival backend first.'
    );
  }
  document.querySelector('#boat-price-service-label').textContent = quote.serviceLabel;
  document.querySelector('#boat-price-service').textContent = money(quote.servicePrice);
  document.querySelector('#boat-price-interior').textContent = quote.interiorPrice
    ? money(quote.interiorPrice)
    : 'Not selected';
  document.querySelector('#boat-price-travel').textContent = quote.travelPrice
    ? money(quote.travelPrice)
    : 'Included';
  document.querySelector('#boat-price-total').textContent = money(quote.total);
  boatPrice.hidden = false;
}

function milesBetween(first, second) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const lat1 = radians(first.latitude);
  const lat2 = radians(second.latitude);
  const deltaLat = radians(second.latitude - first.latitude);
  const deltaLon = radians(second.longitude - first.longitude);
  const a = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function localQuote(locationInput, service, length, interiorService) {
  const entered = locationInput.toLowerCase().trim();
  const postcode = marinaPostcodes[entered] || locationInput;
  const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
  if (!response.ok) throw new Error('Please enter a recognised marina name or complete postcode.');
  const { result } = await response.json();
  const feet = Number(length);
  const band = localBoatPrices.find(([maximum]) => feet <= maximum);
  const serviceDetails = {
    'boat-regular': [1, 'Regular Wash'],
    'boat-oneoff': [2, 'Shine & Protect']
  }[service];
  if (!band || !serviceDetails) throw new Error('Please choose a valid cleaning service.');
  const servicePrice = band[serviceDetails[0]];
  const interiorBand = feet <= 49 ? [80, 250] : feet <= 69 ? [120, 375] : [160, 500];
  const interiorPrice = interiorService === 'Interior clean' ? interiorBand[0]
    : interiorService === 'Full interior detail' ? interiorBand[1] : 0;
  const roadMiles = milesBetween(
    { latitude: 51.4545, longitude: -2.5879 },
    { latitude: result.latitude, longitude: result.longitude }
  ) * 1.2;
  const travelPrice = Math.ceil((Math.max(0, roadMiles - 15) * 1.2) / 5) * 5;
  return {
    serviceLabel: serviceDetails[1], servicePrice, interiorPrice, travelPrice,
    total: servicePrice + interiorPrice + travelPrice
  };
}

function updateArrangement() {
  const regular = boatService.value === 'boat-regular';
  regularFrequency.style.display = regular ? 'flex' : 'none';
  frequencySelect.disabled = !regular;
  resetDates();
}

boatBookingForm
  .querySelectorAll('[name="locationQuery"], [name="service"], [name="interiorService"]')
  .forEach((field) => field.addEventListener('change', resetDates));

boatService.addEventListener('change', updateArrangement);
boatType.addEventListener('change', () => updateBoatExamples(Number(boatLength.value)));
boatLength.addEventListener('input', () => {
  updateBoatLength();
  resetDates();
});
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
      const params = new URLSearchParams({
        location,
        service,
        length: boatLength.value,
        interiorService: boatBookingForm.interiorService.value
      });
      if (!/^https:\/\/script\.google\.com\//.test(bookingApi)) {
        throw new Error('Online booking is being updated. Please send an enquiry for now.');
      }
      params.set('action', 'availability');
      const response = await fetch(`${bookingApi}?${params}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to check availability.');
      }

      const quote = data.quote || await localQuote(
        location,
        service,
        boatLength.value,
        boatBookingForm.interiorService.value
      );
      showQuote(quote);

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
    if (!/^https:\/\/script\.google\.com\//.test(bookingApi)) {
      throw new Error('Online booking is being updated. Please send an enquiry for now.');
    }
    const response = await fetch(bookingApi, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok || data.error || !data.url) {
      throw new Error(data.error || 'Unable to complete the booking.');
    }

    window.location.href = data.url;
  } catch (error) {
    boatBookingStatus.textContent =
      error.message || 'Unable to complete the booking. Please try again.';
  }
});

document.querySelector('#enquiry-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const enquiryForm = event.currentTarget;
  const enquiryStatus = document.querySelector('#enquiry-status');
  enquiryStatus.textContent = 'Sending…';

  try {
    if (!/^https:\/\/script\.google\.com\//.test(bookingApi)) {
      throw new Error('Online enquiries are being updated. Please email or call for now.');
    }
    const payload = Object.fromEntries(new FormData(enquiryForm));
    payload.action = 'enquiry';
    const response = await fetch(bookingApi, {
      method: 'POST',
      headers: { 'content-type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Unable to send the enquiry.');
    enquiryForm.reset();
    enquiryStatus.textContent = 'Thank you — your enquiry has been sent.';
  } catch (error) {
    enquiryStatus.textContent = error.message || 'Unable to send the enquiry.';
  }
});
