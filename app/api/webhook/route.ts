import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfilCheckout } from "@/lib/fulfil";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const liveSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const testSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;
  if (!liveSecret && !testSecret) {
    console.error("webhook: STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event | null = null;
  if (liveSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, liveSecret);
    } catch {
      /* try test secret */
    }
  }
  if (!event && testSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, testSecret);
    } catch {
      /* fall through */
    }
  }
  if (!event) {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    await fulfilCheckout(session);
  } catch (err) {
    console.error("fulfil failed", err);
    return NextResponse.json({ error: "fulfil_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
