export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  items: FaqItem[];
}

export function FaqSection({ title = "Vanliga frågor", items }: FaqSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-10 rounded-lg border border-[#DDD9CE] bg-white p-6 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-editorial text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-stone-200">
        {items.map((item) => (
          <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-zinc-900 marker:content-none hover:text-[#143A66] sm:text-base">
              <span>{item.question}</span>
              <span className="font-mono-num shrink-0 text-lg font-normal text-stone-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-stone-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
