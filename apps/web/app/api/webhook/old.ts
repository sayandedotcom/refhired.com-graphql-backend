import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

import prisma from "@referrer/prisma";

import { stripe } from "@/lib/stripe";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;
// ! const webhookHandler = async (req: NextRequest) => {
export async function POST(req: NextRequest, res: any) {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;
    let event: Stripe.Event;
    // let event: any;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        },
        { status: 400 }
      );
    }
    const { metadata } = event.data.object as Stripe.Checkout.Session;
    switch (event.type) {
      case "checkout.session.completed":
        if (metadata?.userId && metadata?.stars) {
          await prisma.user.update({
            where: {
              id: metadata.userId.toString(),
            },
            data: {
              stars: {
                increment: +metadata?.stars,
              },
            },
          });
        }
        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }
    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: `Method Not Allowed`,
        },
      },
      { status: 405 }
    ).headers.set("Allow", "POST");
  }
}
// ! export { webhookHandler as POST };

// import { headers } from "next/headers";

// // import { clerkClient } from "@clerk/nextjs";
// import type Stripe from "stripe";
// import { env } from "~/data/env";
// import { userPrivateMetadataSchema } from "~/data/valids/auth";
// import { stripe } from "~/server/stripe";

// export async function POST(req: Request) {
//   const body = await req.text();
//   const signature = headers().get("Stripe-Signature") ?? "";

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     return new Response(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`, {
//       status: 400,
//     });
//   }

//   const session = event.data.object as Stripe.Checkout.Session;

//   if (!session?.metadata?.userId) {
//     return new Response(null, { status: 200 });
//   }

//   if (event.type === "checkout.session.completed") {
//     // Retrieve the subscription details from Stripe
//     const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

//     // Unsubscribe the user from the previous plan if they are subscribed to another plan
//     // TODO: Need to find an alternative for this. This is a bit hacky.
//     const user = await clerkClient.users.getUser(session.metadata.userId);

//     const stripeSubscriptionId = userPrivateMetadataSchema.shape.stripeSubscriptionId.parse(
//       user.privateMetadata.stripeSubscriptionId
//     );

//     if (subscription.customer && stripeSubscriptionId) {
//       await stripe.subscriptions.update(stripeSubscriptionId, {
//         cancel_at_period_end: true,
//       });
//     }

//     // Update the user stripe into in our database.
//     // Since this is the initial subscription, we need to update
//     // the subscription id and customer id.
//     await clerkClient.users.updateUserMetadata(session?.metadata?.userId, {
//       privateMetadata: {
//         stripeSubscriptionId: subscription.id,
//         stripeCustomerId: subscription.customer as string,
//         stripePriceId: subscription.items.data[0]?.price.id,
//         stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
//       },
//     });
//   }

//   if (event.type === "invoice.payment_succeeded") {
//     // Retrieve the subscription details from Stripe
//     const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

//     // Update the price id and set the new period end
//     await clerkClient.users.updateUserMetadata(subscription.id, {
//       privateMetadata: {
//         stripePriceId: subscription.items.data[0]?.price.id,
//         stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
//       },
//     });
//   }

// // Handle payment intents
// switch (event.type) {
//   case "payment_intent.payment_failed":
//     // Handle the payment_intent.payment_failed event
//     break
//   case "payment_intent.processing":
//     // Handle the payment_intent.processing event
//     break
//   case "payment_intent.succeeded":
//     // Handle the payment_intent.succeeded event

//     const stripeObject = event?.data?.object as Stripe.PaymentIntent

//     const paymentIntentId = stripeObject?.id
//     const orderTotal = stripeObject?.amount
//     const cartItems = stripeObject?.metadata
//       ?.items as unknown as CheckoutItem[]

//     console.log({
//       paymentIntentId,
//       orderTotal,
//       cartItems,
//     })

//     try {
//       if (!event.account) throw new Error("No account on event")

//       const payment = await db.query.payments.findFirst({
//         columns: {
//           storeId: true,
//         },
//         where: eq(payments.stripeAccountId, event.account),
//       })

//       if (!payment?.storeId) {
//         return new Response("Store not found", { status: 404 })
//       }

//       // Create new address in DB
//       const stripeAddress = stripeObject?.shipping?.address

//       const newAddress = await db.insert(addresses).values({
//         line1: stripeAddress?.line1,
//         line2: stripeAddress?.line2,
//         city: stripeAddress?.city,
//         state: stripeAddress?.state,
//         country: stripeAddress?.country,
//         postalCode: stripeAddress?.postal_code,
//       })

//       if (!newAddress.insertId) throw new Error("No address created.")

//       // Create new order in DB
//       const newOrder = await db.insert(orders).values({
//         storeId: payment.storeId,
//         items: cartItems ?? [],
//         total: String(Number(orderTotal) / 100),
//         stripePaymentIntentId: paymentIntentId,
//         stripePaymentIntentStatus: stripeObject?.status,
//         name: stripeObject?.shipping?.name,
//         email: stripeObject?.receipt_email,
//         addressId: Number(newAddress.insertId),
//       })

//       console.log("Order created", newOrder)
//     } catch (err) {
//       console.log("Error creating order.", err)
//     }

//     try {
//       // Close cart and clear items
//       await db
//         .update(carts)
//         .set({
//           closed: true,
//           items: [],
//         })
//         .where(eq(carts.paymentIntentId, paymentIntentId))
//     } catch (err) {
//       console.error(err)
//       return new Response("Error updating cart", { status: 500 })
//     }

//     break
//   default:
//     console.log(`Unhandled event type ${event.type}`)
// }

//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       console.log(`PaymentIntent status: ${paymentIntent.status}`);
//       break;
//     }
//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
//       break;
//     }
//     case "charge.succeeded": {
//       const charge = event.data.object as Stripe.Charge;
//       console.log(`Charge id: ${charge.id}`);
//       break;
//     }
//     default: {
//       console.warn(`Unhandled event type: ${event.type}`);
//       break;
//     }
//   }

//   return new Response(null, { status: 200 });
// }
