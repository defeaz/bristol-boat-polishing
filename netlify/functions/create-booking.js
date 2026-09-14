import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  canFitBooking,
  isServed,
  postcodeArea,
  serviceLoad
} from '../../lib/config.js';

export default async (req) => {
  if (req.method !== 'POST') return new Response('', { status: 405 });

  const booking = await req.json();
  const required = [
    'date',
    'postcode',
    'service',
    'vehicleType',
    'model',
    'location',
    'length',
    'name',
    'email',
    'phone'
  ];

  if (
    required.some((field) => !String(booking[field] || '').trim()) ||
    !isServed(booking.postcode) ||
    !serviceLoad(booking.service)
  ) {
    return Response.json(
      { error: 'Please check the booking details.' },
      { status: 400 }
    );
  }

  const area = postcodeArea(booking.postcode);
  const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data: existing, error: readError } = await db
    .from('bookings')
    .select('postcode_area,service,status')
    .eq('booking_date', booking.date)
    .neq('status', 'cancelled');

  if (readError) {
    return Response.json(
      { error: 'The calendar could not be checked. Please try again.' },
      { status: 500 }
    );
  }

  if (!canFitBooking(existing || [], booking.service, area)) {
    return Response.json(
      {
        error:
          'That date has just filled or is now reserved for work in another area. Please choose another.'
      },
      { status: 409 }
    );
  }

  const id = crypto.randomUUID();
  const arrangement =
    booking.service === 'boat-regular' ? 'Regular cleaning' : 'One-off clean';
  const frequency =
    booking.service === 'boat-regular' && booking.frequency
      ? ` · ${booking.frequency}`
      : '';
  const model = `${booking.model} · ${booking.length} ft · ${booking.location}${frequency}`;
  const { error: insertError } = await db.from('bookings').insert({
    id,
    booking_date: booking.date,
    postcode: booking.postcode.toUpperCase(),
    postcode_area: area,
    service: booking.service,
    size: `${booking.length} ft`,
    vehicle_type: booking.vehicleType,
    model,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    clean_price: 0,
    status: 'awaiting_payment'
  });

  if (insertError) {
    return Response.json(
      { error: 'The booking could not be reserved. Please try again.' },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const base = process.env.URL || 'https://harbourshine.com';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: 3000,
            product_data: {
              name: 'Harbour Shine booking deposit',
              description: `${booking.date} · ${booking.model} · ${arrangement}`
            }
          },
          quantity: 1
        }
      ],
      metadata: { booking_id: id, business: 'harbour-shine' },
      success_url: `${base}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/#book`,
      payment_intent_data: {
        description: `Harbour Shine deposit for ${booking.name} — ${booking.date}`
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    await db.from('bookings').delete().eq('id', id);
    return Response.json(
      { error: 'Secure payment could not be started. Please try again.' },
      { status: 500 }
    );
  }
};
