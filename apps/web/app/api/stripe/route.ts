import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "@refhiredcom/features/auth/lib/auth";

import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";

  // const billingUrl = siteConfig(locale).url + "/dashboard/billing/";
  const { planId = process.env.STRIPE_CUST0M_PRICE_ID, quantity = 1, stars } = await req.json();

  try {
    const { user } = await getAuthSession();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price: planId,
          quantity,
        },
      ],
      metadata: {
        userId: user.id,
        stars,
      },
      success_url: `http://localhost:3000/${locale}`,
      cancel_url: `http://localhost:3000/${locale}/pricing`,
    });

    return new NextResponse(JSON.stringify({ url: checkoutSession.url }));
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
