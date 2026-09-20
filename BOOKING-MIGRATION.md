# Booking migration

Harbour Shine now uses the same Google Apps Script booking backend, Google
Sheet and Google Calendar as Caravan Revival. Stripe remains only for the £30
deposit. The canonical backend source and setup guide are in the
`caravan-revival/google-apps-script` directory.

After deploying that web app, paste its `/exec` URL into `booking-config.js`.
The site is then ready to deploy with the included GitHub Pages workflow.
