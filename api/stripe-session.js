import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return response.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured.' });
  }

  const { session_id: sessionId } = request.query || {};

  if (!sessionId) {
    return response.status(400).json({ error: 'session_id is required.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return response.status(200).json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_details: session.customer_details,
      metadata: session.metadata,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || 'Failed to retrieve Stripe checkout session.',
    });
  }
}
