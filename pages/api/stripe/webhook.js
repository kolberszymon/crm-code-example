import { buffer } from 'micro';
import Stripe from 'stripe';
import { createTrainingPurchase } from '@/lib/api-functions/create-training-purchase';
import { Currency } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, so we can handle the raw body
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object;
          const trainingId = checkoutSession.metadata.trainingId;

          // Retrieve the line items for the session
          const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            checkoutSession.id,
            { expand: ['line_items'] }
          );

          const customerEmail = checkoutSession.customer_details.email;
          const lineItems = sessionWithLineItems.line_items.data;
          const price = lineItems[0].amount_total; // Assuming there's only one item

          const { success, msg, trainingPurchaseId } = await createTrainingPurchase(trainingId, customerEmail, price / 100, Currency.PLN);

          if (success) {

            const response = await fetch(`http://localhost:3000/api/email/send-training-pdf`, {
              method: 'POST',
              body: JSON.stringify({ trainingPurchaseId: trainingPurchaseId, email: customerEmail }),
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              console.log(`Failed to send email: ${response.statusText}`);
            }
          } else {
            console.log(`Error creating training purchase: ${msg}`);
          }
          
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}