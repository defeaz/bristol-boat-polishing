# Harbour Shine booking setup

The site is ready for Netlify and uses the same Supabase `bookings` and
`available_dates` tables as Caravan Revival.

In the Harbour Shine Netlify site's environment variables, add the same values
used by Caravan Revival for:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`

Also set `URL` to `https://harbourshine.com`.

Deploy the updated Caravan Revival files as well. Its shared availability
logic now recognises both businesses, and its Stripe webhook sends the correct
confirmation email for Harbour Shine boat bookings.

Capacity is calculated as:

- Caravan one-off: half a day
- Caravan ongoing: one fifth of a day
- Boat one-off: one full day
- Boat regular: one third of a day

Bookings can share a day only when they have the same outward postcode area.
