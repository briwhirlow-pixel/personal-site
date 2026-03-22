const tools = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Shopify",
  "Figma", "Node.js", "Supabase", "Vercel", "Framer",
  "WordPress", "SEO", "E-Commerce", "CMS", "Stripe",
];

export default function LogoMarquee() {
  const doubled = [...tools, ...tools];

  return (
    <div className="bg-[#F2F1EC] border-y border-[#E5E4DF] py-5 overflow-hidden">
      <div className="flex items-center gap-0" style={{ animation: 'marquee 28s linear infinite' }}>
        {doubled.map((tool, i) => (
          <div key={i} className="flex items-center gap-0 flex-shrink-0">
            <span className="text-[13px] font-semibold text-[#737373] tracking-wide whitespace-nowrap px-8 hover:text-[#2563EB] transition-colors cursor-default">
              {tool}
            </span>
            <span className="text-[#CECCC6] text-[10px]">✦</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
