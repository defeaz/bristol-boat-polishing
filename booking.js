const boatForm = document.querySelector('#booking-form');
const boatStatus = document.querySelector('#booking-status');
const boatFields = document.querySelector('#boat-booking-fields');
const boatType = document.querySelector('#boat-type');
const boatLength = document.querySelector('#boat-length');
const boatImage = document.querySelector('#classic-boat-size');
const api = window.BOOKING_API_URL;
const money = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
const base = 'assets/boats/sizes/';
// Eight real-world-plausible length/profile choices per category. Images are representative,
// while the customer's make/model is captured separately for the final work plan.
const catalogue = {
  'Small boat': [
    [10,'Open dinghy','small-boat-v2/dinghy-10ft.png'],
    [14,'Compact RIB','small-boat-v2/rib-14ft.png'],
    [16,'Fishing boat','small-boat/orkney-16ft.png'],
    [18,'Runabout','small-boat/small-rib.png'],
    [21,'Offshore RIB','small-boat/large-rib.png'],
    [24,'Cuddy cruiser','small-boat/small-cruiser.png'],
    [27,'Sports cruiser','cruiser/sports-cruiser.png'],
    [33,'Cabin cruiser','cruiser/cabin-cruiser.png']
  ],
  'Sailing yacht': [
    [20,'Pocket cruiser','sailing-yacht-v3/pocket-cruiser-20ft.png'],
    [27,'Coastal yacht','sailing-yacht/compact-sailing-yacht.png'],
    [34,'Cruising yacht','sailing-yacht-v3/classic-cruiser-30ft.png'],
    [42,'Modern cruiser','sailing-yacht/cruising-yacht.png'],
    [50,'Offshore yacht','sailing-yacht-v3/offshore-performance-45ft.png'],
    [65,'Deck saloon','sailing-yacht-v3/deck-saloon-65ft.png'],
    [85,'Large sailing yacht','sailing-yacht/large-sailing-yacht.png'],
    [130,'Sailing superyacht','sailing-yacht-v3/sailing-superyacht-100ft.png']
  ],
  'Motor yacht': [
    [25,'Sports cruiser','motor-yacht/sports-cruiser.png'],
    [33,'Cabin cruiser','cruiser/cabin-cruiser.png'],
    [40,'Flybridge cruiser','cruiser/flybridge-cruiser.png'],
    [55,'Flybridge yacht','motor-yacht/flybridge.png'],
    [72,'Motor yacht','motor-yacht/cabin-motor-yacht.png'],
    [95,'Large motor yacht','motor-yacht/large-motor-yacht.png'],
    [120,'Superyacht','superyacht/motor-yacht.png'],
    [160,'Large superyacht','superyacht/full-size-superyacht.png']
  ],
  'Canal boat': [
    [20,'Day boat','canal-boat-v2/day-boat-20ft.png'],
    [25,'Short narrowboat','narrowboat/short-narrowboat.png'],
    [30,'Traditional stern','canal-boat-v2/traditional-30ft.png'],
    [40,'Cruiser stern','canal-boat-v2/cruiser-45ft.png'],
    [45,'Narrowboat','canal-boat-v2/cruiser-45ft.png'],
    [57,'Liveaboard narrowboat','canal-boat-v2/liveaboard-57ft.png'],
    [65,'Long narrowboat','narrowboat/long-narrowboat.png'],
    [70,'Widebeam canal boat','canal-boat-v2/widebeam-70ft.png']
  ]
};
const priceBands = [[19,95,350],[29,125,425],[39,155,500],[49,185,600],[59,225,725],[69,275,875],[79,340,1050],[89,420,1250],[100,520,1500]];
let selected=3, quote=0, requestVersion=0;
function boatPrice(feet,service){
  const band=priceBands.find(([max])=>feet<=max);
  if(band)return band[service==='boat-regular'?1:2];
  const extra=Math.ceil((feet-100)/10);
  return service==='boat-regular'?520+extra*300:1500+extra*800;
}
function interiorPrice(feet,choice){
  if(choice==='No interior cleaning')return 0;
  const band=feet<=49?[80,250]:feet<=69?[120,375]:feet<=100?[160,500]:feet<=130?[220,700]:[300,950];
  return band[choice==='Interior clean'?0:1];
}
function resetDates(){requestVersion++;boatFields.hidden=true;document.querySelector('#boat-date').replaceChildren();boatStatus.textContent='';document.querySelector('#boat-price-travel').textContent='Calculated with location';}
function refresh(){
  const item=catalogue[boatType.value][selected];
  boatLength.value=item[0];boatImage.src=base+item[2];boatImage.alt=`Representative ${item[1].toLowerCase()} profile`;
  document.querySelector('#boat-length-output').textContent=`${item[0]} ft`;
  document.querySelector('#boat-profile-caption').textContent=item[1];
  document.querySelectorAll('.boat-profile-option').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===selected)));
  const service=boatForm.elements.service.value, interior=boatForm.elements.interiorService.value;
  const servicePrice=boatPrice(item[0],service), inside=interiorPrice(item[0],interior);
  quote=servicePrice+inside;
  document.querySelector('#boat-price-service-label').textContent=service==='boat-regular'?'Regular Wash':'Shine & Protect';
  document.querySelector('#boat-price-service').textContent=money(servicePrice);
  document.querySelector('#boat-interior-label').textContent=interior;
  document.querySelector('#boat-price-interior').textContent=money(inside);
  document.querySelector('#boat-price-total').textContent=money(quote);
  const frequency=document.querySelector('#regular-frequency');frequency.hidden=service!=='boat-regular';frequency.querySelector('select').disabled=service!=='boat-regular';
  document.querySelectorAll('[name="interiorService"]').forEach(el=>{el.disabled=boatType.value==='Small boat'&&item[0]<=18&&el.value!=='No interior cleaning';});
}
function renderProfiles(){
  const items=catalogue[boatType.value];
  document.querySelector('#boat-profile-options').replaceChildren(...items.map(([feet,label,path],index)=>{
    const button=document.createElement('button');button.type='button';button.className='boat-profile-option';button.setAttribute('aria-label',`${feet} ft ${label}`);
    const thumb=document.createElement('img');thumb.src=base+path;thumb.alt='';thumb.loading='lazy';
    const text=document.createElement('span');text.textContent=`${feet} ft`;
    button.append(thumb,text);button.addEventListener('click',()=>{selected=index;if(boatType.value==='Small boat'&&feet<=18)boatForm.querySelector('[name="interiorService"][value="No interior cleaning"]').checked=true;resetDates();refresh();});
    return button;
  }));refresh();
}
boatForm.querySelectorAll('[name="boatTypeChoice"]').forEach(el=>el.addEventListener('change',()=>{boatType.value=el.value;selected=el.value==='Motor yacht'?3:0;boatForm.querySelector('[name="interiorService"][value="No interior cleaning"]').checked=true;resetDates();renderProfiles();}));
boatForm.querySelectorAll('[name="service"],[name="interiorService"]').forEach(el=>el.addEventListener('change',()=>{resetDates();refresh();}));
boatForm.locationQuery.addEventListener('input',resetDates);
renderProfiles();
const marinas={
  'bristol marina':'BS1 6XQ','bristol harbour':'BS1 5UH','bristol floating harbour':'BS1 5UH',
  'portishead marina':'BS20 7DF','portavon marina':'BS31 2DD','keynsham marina':'BS31 2DD',
  'saltford marina':'BS31 3JS','bath marina':'BA2 1SQ','devizes marina':'SN10 1QR',
  'sharpness marina':'GL13 9UN','saul marina':'GL2 7JY','gloucester docks':'GL1 2EH',
  'tewkesbury marina':'GL20 5BY','upton marina':'WR8 0PB','cardiff marina':'CF11 0JL',
  'cardiff bay marina':'CF10 4LY','penarth marina':'CF64 1TQ','barry marina':'CF62 5TQ',
  'chepstow marina':'NP16 5HH'
};
async function travelFor(location){
  const postcode=marinas[location.toLowerCase().trim()]||location;
  try{
    const response=await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    if(!response.ok)return null;
    const {result}=await response.json();
    const radians=n=>n*Math.PI/180, lat=radians(result.latitude-51.4545),lon=radians(result.longitude+2.5879);
    const a=Math.sin(lat/2)**2+Math.cos(radians(51.4545))*Math.cos(radians(result.latitude))*Math.sin(lon/2)**2;
    const miles=3958.8*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*1.2;
    return Math.ceil(Math.max(0,miles-15)*1.2/5)*5;
  }catch{return null;}
}
document.querySelector('#find-boat-dates').addEventListener('click',async()=>{
  const locationInput=boatForm.locationQuery.value.trim();resetDates();const version=requestVersion;
  if(locationInput.length<3){boatStatus.textContent='Enter a marina or full postcode first.';return;}
  boatStatus.textContent='Checking dates…';
  try{
    const params=new URLSearchParams({action:'availability',location:locationInput,service:boatForm.elements.service.value});
    let data,lastError;
    for(let attempt=0;attempt<2;attempt++){
      try{const response=await fetch(`${api}?${params}`);data=await response.json();if(!response.ok||data.error)throw new Error(data.error||'Dates could not be checked.');break;}
      catch(error){lastError=error;if(attempt===0)boatStatus.textContent='Still checking dates…';}
    }
    if(!data)throw lastError||new Error('Dates could not be checked.');
    const travel=await travelFor(locationInput);
    if(version!==requestVersion)return;
    document.querySelector('#boat-price-travel').textContent=travel===null?'To confirm':travel?money(travel):'Included';
    document.querySelector('#boat-price-total').textContent=money(quote+(travel||0));
    if(!data.dates?.length)throw new Error('No suitable dates are open right now. Please send an enquiry.');
    document.querySelector('#boat-date').replaceChildren(...data.dates.map(({value,label})=>new Option(label,value)));
    boatFields.hidden=false;boatStatus.textContent='Choose a date to reserve your booking.';
  }catch(error){if(version===requestVersion)boatStatus.textContent=error.message||'Dates could not be checked.';}
});
boatForm.addEventListener('submit',async event=>{
  event.preventDefault();if(boatFields.hidden)return;boatStatus.textContent='Opening secure payment…';
  const payload=Object.fromEntries(new FormData(boatForm));payload.cleanPrice=Number(document.querySelector('#boat-price-total').textContent.replace(/[^0-9]/g,''));
  try{const response=await fetch(api,{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const data=await response.json();if(!response.ok||data.error||!data.url)throw new Error(data.error||'Booking could not be started.');location.href=data.url;
  }catch(error){boatStatus.textContent=error.message||'Booking could not be started.';}
});
