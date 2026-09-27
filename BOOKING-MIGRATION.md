# Live booking setup

GitHub Pages publishes this site from the root of the `migrate-github-pages` branch at https://harbourshine.com. Its availability, enquiries, and £30 Stripe deposit use the shared Google Apps Script deployment URL in `booking-config.js`.

The Google Apps Script project manages the `Bookings`, `Availability`, and `Enquiries` sheets and the shared Google Calendar. The source is maintained separately in the owner's Google account. Never put Stripe keys or Google credentials in this repository.

Edit the root `index.html`, `booking.js`, or `booking-studio.css` on this branch. The `main` branch is an older site and is not the Pages source.
