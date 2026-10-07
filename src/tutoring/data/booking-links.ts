// Scheduling and payment live on booking.rjmlaird.co.uk (Cal.com + Stripe).
const base = 'https://booking.rjmlaird.co.uk/tutoring';

export const bookingLinks = {
  index: `${base}/`,
  consultation: `${base}/consultation`,
  session: (id: string) => `${base}/${id}`,
};
