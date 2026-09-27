document.querySelectorAll('.site-enquiry-form').forEach(form=>form.addEventListener('submit',async event=>{
  event.preventDefault();
  const status=form.querySelector('.enquiry-status');status.textContent='Sending…';
  const payload=Object.fromEntries(new FormData(form));payload.action='enquiry';payload.business='Harbour Shine';
  if(payload.service)payload.message=`${payload.service}\n${payload.message}`;
  try{
    const response=await fetch(window.BOOKING_API_URL,{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const data=await response.json();if(!response.ok||data.error)throw new Error(data.error||'The request could not be sent.');
    form.reset();status.textContent='Thanks — your request has been sent.';
  }catch(error){status.textContent=error.message||'The request could not be sent. Please call us.';}
}));
