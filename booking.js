const boatForm = document.querySelector('#booking-form');
const boatStatus = document.querySelector('#booking-status');
const boatFields = document.querySelector('#boat-booking-fields');
const boatType = document.querySelector('#boat-type');
const boatLength = document.querySelector('#boat-length');
const boatImage = document.querySelector('#classic-boat-size');
const api = window.BOOKING_API_URL;
const money = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
const base = 'assets/boats/sizes/';
// Illustrations are representative; the customer's make/model is captured separately.
const catalogue = {
  'Small boat': [
    [10,'Open dinghy','small-boat-v2/dinghy-10ft.png'],
    [14,'Compact RIB','small-boat-v2/rib-14ft.png'],
    [16,'Fishing boat','small-boat/orkney-16ft.png'],
    [18,'Runabout RIB','small-boat/small-rib.png'],
    [22,'Offshore RIB','small-boat/large-rib.png']
  ],
  'Sailing yacht': [
    [20,'Pocket cruiser','sailing-yacht-v3/pocket-cruiser-20ft.png'],
    [27,'Coastal yacht','sailing-yacht/compact-sailing-yacht.png'],
    [34,'Cruising yacht','sailing-yacht-v3/classic-cruiser-30ft.png'],
    [42,'Modern cruiser','sailing-yacht/cruising-yacht.png'],
    [50,'Offshore yacht','sailing-yacht-v3/offshore-performance-45ft.png'],
    [100,'Large sailing yacht','sailing-yacht-v3/sailing-superyacht-100ft.png']
  ],
  'Motor yacht': [
    [25,'Sports cruiser','motor-yacht/sports-cruiser.png'],
    [33,'Cabin cruiser','cruiser/cabin-cruiser.png'],
    [40,'Flybridge cruiser','cruiser/flybridge-cruiser.png'],
    [55,'Flybridge yacht','motor-yacht/flybridge.png'],
    [72,'Motor yacht','motor-yacht/cabin-motor-yacht.png'],
    [90,'Large motor yacht','motor-yacht/large-motor-yacht.png'],
    [100,'Three-deck motor yacht','superyacht/three-deck-100ft-ink.webp']
  ],
  'Canal boat': [
    [20,'Day boat','canal-boat-v3/day-20.webp'],
    [30,'Traditional stern','canal-boat-v3/traditional-30.webp'],
    [40,'Cruiser stern','canal-boat-v3/cruiser-40.webp'],
    [57,'Liveaboard narrowboat','canal-boat-v3/liveaboard-57.webp'],
    [70,'Widebeam canal boat','canal-boat-v3/widebeam-70.webp']
  ]
};
// Gradual length-based estimates; changing the slider by one foot never crosses a price bracket.
const exteriorPrices = [[10,180,500],[20,200,530],[30,240,600],[40,300,700],[50,380,840],[60,470,1015],[70,580,1225],[80,710,1470],[90,870,1750],[100,1050,2100]];
const interiorPrices = [[10,60,180],[20,60,180],[30,70,220],[50,80,250],[70,120,375],[100,160,500]];
let quote=0, requestVersion=0;
function interpolate(feet,points,column){
  if(feet<=points[0][0])return points[0][column];
  for(let i=1;i<points.length;i++)if(feet<=points[i][0]){
    const lower=points[i-1], upper=points[i];
    return lower[column]+(upper[column]-lower[column])*(feet-lower[0])/(upper[0]-lower[0]);
  }
  return points.at(-1)[column];
}
function boatPrice(feet,service,visitType){
  const base=interpolate(feet,exteriorPrices,service==='boat-regular'?1:2);
  return Math.round(base*(visitType==='Regular'?.7:1));
}
function interiorPrice(feet,choice){
  if(choice==='No interior cleaning')return 0;
  return Math.round(interpolate(feet,interiorPrices,choice==='Interior clean'?1:2));
}
function resetDates(){requestVersion++;boatFields.hidden=true;document.querySelector('#boat-date').replaceChildren();boatStatus.textContent='';document.querySelector('#boat-price-travel').textContent='Calculated with location';}
function refresh(){
  const feet=Number(boatLength.value), items=catalogue[boatType.value];
  const item=items.reduce((nearest,current)=>Math.abs(current[0]-feet)<Math.abs(nearest[0]-feet)?current:nearest);
  boatImage.src=base+item[2];boatImage.alt=`Representative ${item[1].toLowerCase()} profile`;
  const canalScale={20:.75,30:.9,40:.78,57:.86,70:1};
  boatImage.style.transform=`scale(${boatType.value==='Canal boat'?canalScale[item[0]]:1})`;
  document.querySelector('#boat-length-output').textContent=`${feet} ft`;
  document.querySelector('#boat-profile-caption').textContent=item[1];
  boatLength.style.setProperty('--range-progress',`${(feet-Number(boatLength.min))/(Number(boatLength.max)-Number(boatLength.min))*100}%`);
  const service=boatForm.elements.service.value, interior=boatForm.elements.interiorService.value;
  const visitType=boatForm.elements.visitType.value;
  const oneOffPrice=boatPrice(feet,service,'One-off');
  const saving=visitType==='Regular'?oneOffPrice-boatPrice(feet,service,'Regular'):0;
  const servicePrice=oneOffPrice-saving, inside=interiorPrice(feet,interior);
  quote=servicePrice+inside;
  document.querySelector('#boat-price-service-label').textContent=service==='boat-regular'?'Full Wash':'Shine & Protect';
  document.querySelector('#boat-service-description').hidden=service!=='boat-oneoff';
  document.querySelector('#boat-price-service').textContent=money(oneOffPrice);
  document.querySelector('#boat-regular-saving').hidden=!saving;
  document.querySelector('#boat-price-saving').textContent=`−${money(saving)}`;
  document.querySelector('#boat-interior-label').textContent=interior;
  document.querySelector('#boat-price-interior').textContent=money(inside);
  document.querySelector('#boat-price-total').textContent=money(quote);
  const recurring=visitType==='Regular';
  document.querySelector('#regular-frequency').hidden=!recurring;
  boatForm.querySelectorAll('[name="frequency"]').forEach(el=>el.disabled=!recurring);
  document.querySelectorAll('[name="interiorService"]').forEach(el=>{el.disabled=boatType.value==='Small boat'&&feet<=18&&el.value!=='No interior cleaning';});
}
function setBoatRange(){
  const items=catalogue[boatType.value];
  boatLength.min=items[0][0];boatLength.max=items.at(-1)[0];
  boatLength.value=boatType.value==='Motor yacht'?45:items[0][0];
  const labels=document.querySelectorAll('.boat-length-limits span');labels[0].textContent=`${boatLength.min} ft`;labels[1].textContent=`${boatLength.max} ft`;
  refresh();
}
boatForm.querySelectorAll('[name="boatTypeChoice"]').forEach(el=>el.addEventListener('change',()=>{boatType.value=el.value;boatForm.querySelector('[name="interiorService"][value="No interior cleaning"]').checked=true;resetDates();setBoatRange();}));
boatLength.addEventListener('input',()=>{if(boatType.value==='Small boat'&&Number(boatLength.value)<=18)boatForm.querySelector('[name="interiorService"][value="No interior cleaning"]').checked=true;resetDates();refresh();});
boatForm.querySelectorAll('[name="service"],[name="interiorService"],[name="visitType"]').forEach(el=>el.addEventListener('change',()=>{resetDates();refresh();}));
boatForm.locationQuery.addEventListener('input',resetDates);
setBoatRange();
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
