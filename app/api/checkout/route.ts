import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { isValidZip } from "@/lib/medicare";
import { getStripe } from "@/lib/stripe";
import { isValidReportToken } from "@/lib/report-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = getProduct(body.product || "premium");
    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const isUpgrade = product.id === "bundle_upgrade";
    const existingToken = isUpgrade ? String(body.existing_token || "") : "";
    if (isUpgrade && !isValidReportToken(existingToken)) {
      return NextResponse.json({ error: "existing_token required" }, { status: 400 });
    }

    const cpt = String(body.cpt || "").trim().toUpperCase();
    const zip = String(body.zip || "").trim();
    if (!isUpgrade) {
      if (!/^[A-Z0-9]{4,5}$/.test(cpt)) {
        return NextResponse.json({ error: "CPT required" }, { status: 400 });
      }
      if (!isValidZip(zip)) {
        return NextResponse.json({ error: "Valid 5-digit ZIP required" }, { status: 400 });
      }
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const successUrl = isUpgrade
      ? `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${product.id}&upgrade_token=${encodeURIComponent(existingToken)}`
      : `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${product.id}`;
    const cancelUrl = isUpgrade
      ? `${origin}/r/${existingToken}?upgrade=cancelled`
      : `${origin}/procedure/${encodeURIComponent(cpt)}?zip=${encodeURIComponent(zip)}&checkout=cancelled`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: product.priceInCents,
            product_data: {
              name: isUpgrade
                ? product.name
                : `${product.name}: CPT ${cpt} in ${zip}`,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      after_expiration: {
        recovery: { enabled: true, allow_promotion_codes: true },
      },
      allow_promotion_codes: true,
      metadata: {
        product: product.id,
        cpt,
        zip,
        existing_token: existingToken,
      },
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "checkout_failed";
    console.error("checkout failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
