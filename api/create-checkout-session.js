import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getOrigin(request) {
  return request.headers.origin || process.env.APP_URL || `https://${request.headers.host}`;
}

function buildLineItems(items) {
  return items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: 'brl',
      unit_amount: Math.round(Number(item.price) * 100),
      product_data: {
        name: item.name,
        description: `Tamanho ${item.size} • Cor ${item.color}`,
        images: item.image ? [item.image] : undefined,
      },
    },
  }));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return response.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured.' });
  }

  try {
    const { customer, items } = request.body || {};

    if (!customer?.email || !customer?.name || !Array.isArray(items) || items.length === 0) {
      return response.status(400).json({ error: 'Customer data and cart items are required.' });
    }

    const origin = getOrigin(request);
    const lineItems = buildLineItems(items);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      line_items: lineItems,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      allow_promotion_codes: true,
      success_url: `${origin}/stripe/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        customer_json: JSON.stringify(customer),
      },
    });

    return response.status(200).json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || 'Failed to create Stripe checkout session.',
    });
  }
}
