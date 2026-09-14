import { createClient } from '@supabase/supabase-js';
import {
  canFitBooking,
  isServed,
  postcodeArea,
  serviceLoad
} from '../../lib/config.js';

export default async (req) => {
  const url = new URL(req.url);
  const postcode = url.searchParams.get('postcode')?.trim() || '';
  const service = url.searchParams.get('service') || 'boat-oneoff';

  if (!isServed(postcode) || !serviceLoad(service)) {
    return Response.json(
      {
        error:
          'This postcode is outside the Harbour Shine service area. Please send an enquiry if you would like us to consider travelling further.'
      },
      { status: 400 }
    );
  }

  const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 60);
  const firstDay = start.toISOString().slice(0, 10);
  const lastDay = end.toISOString().slice(0, 10);

  const { data: available, error: availabilityError } = await db
    .from('available_dates')
    .select('booking_date')
    .gte('booking_date', firstDay)
    .lte('booking_date', lastDay);

  if (availabilityError) {
    return Response.json(
      { error: 'Availability is temporarily unavailable.' },
      { status: 500 }
    );
  }

  const { data: bookings, error: bookingError } = await db
    .from('bookings')
    .select('booking_date,postcode_area,service,status')
    .gte('booking_date', firstDay)
    .lte('booking_date', lastDay)
    .neq('status', 'cancelled');

  if (bookingError) {
    return Response.json(
      { error: 'Availability is temporarily unavailable.' },
      { status: 500 }
    );
  }

  const availableSet = new Set((available || []).map((item) => item.booking_date));
  const wantedArea = postcodeArea(postcode);
  const dates = [];

  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const value = day.toISOString().slice(0, 10);
    if (!availableSet.has(value)) continue;

    const existing = (bookings || []).filter(
      (booking) => booking.booking_date === value
    );

    if (canFitBooking(existing, service, wantedArea)) {
      dates.push({
        value,
        label: new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        }).format(new Date(`${value}T12:00:00`))
      });
    }

    if (dates.length === 12) break;
  }

  return Response.json({ dates });
};
