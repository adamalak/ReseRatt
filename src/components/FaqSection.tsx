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
    <section className="mt-10 rounded border border-[#CBD5E1] bg-white p-5 sm:p-8 print:hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-editorial text-xl font-semibold tracking-tight text-[#0B1F3A]">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-[#E2E8F0]">
        {items.map((item) => (
          <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-[#0F172A] marker:content-none hover:text-[#0B1F3A] sm:text-base">
              <span>{item.question}</span>
              <span className="font-mono-num shrink-0 text-lg font-normal text-slate-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
