"use client";

import { useState } from "react";

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="surface overflow-hidden divide-y divide-[var(--hairline)]">
      {items.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left min-h-14"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-[0.975rem] tracking-tight text-ink">{faq.q}</span>
              <span
                className={`shrink-0 text-faint text-xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div className={`faq-answer ${isOpen ? "open" : ""}`}>
              <div>
                <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
