import { NextRequest, NextResponse } from "next/server";
import { fulfilCheckout } from "@/lib/fulfil";
import { getStripe } from "@/lib/stripe";
import { loadStoredReport } from "@/lib/reports-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { session_id: sessionId } = await req.json();
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "not_paid" }, { status: 402 });
  }
  const { token } = await fulfilCheckout(session);
  const stored = await loadStoredReport(token);
  return NextResponse.json({ token, ready: Boolean(stored) });
}
