"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutProgress({
  token,
  sessionId,
  isUpgrade,
}: {
  token: string | null;
  sessionId?: string;
  isUpgrade?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("Building your cost report…");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (sessionId && !isUpgrade) {
        try {
          await fetch("/api/checkout/fulfil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          });
        } catch {
          /* webhook may already have fulfilled */
        }
      }
      if (!token) {
        setMessage("Payment received, but the report link is missing. Check your email.");
        return;
      }
      for (let i = 0; i < 20; i++) {
        const res = await fetch(`/api/r/${token}/status`);
        const data = await res.json();
        if (cancelled) return;
        if (data.ready) {
          router.replace(`/r/${token}`);
          return;
        }
        setMessage("Almost ready…");
        await new Promise((r) => setTimeout(r, 1000));
      }
      setMessage("Still working. Open the link in your email, or refresh this page.");
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token, sessionId, isUpgrade, router]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment received</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
