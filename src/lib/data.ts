export const siteConfig = {
  name: "Brian Whirlow",
  tagline: "Web Designer & Developer",
  description:
    "I design and build fast, beautiful websites that help businesses grow. From simple brochure sites to full e-commerce stores — I handle it all.",
  email: "brian@brianwhirlow.com",
  calendlyUrl: "#",
  social: {
    github: "#",
    linkedin: "#",
  },
};

export type ServiceTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

export const services: ServiceTier[] = [
  {
    name: "Starter",
    price: "Starting at $500",
    description:
      "Perfect for small businesses who need a clean, professional online presence — fast.",
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "2 rounds of revisions",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "Starting at $1,200",
    description:
      "For businesses ready to stand out. Custom design, more pages, and the tools to manage your content.",
    features: [
      "Up to 10 pages",
      "Custom design system",
      "CMS integration",
      "SEO optimization",
      "Google Analytics",
      "3 rounds of revisions",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description:
      "E-commerce, web apps, ongoing retainers — if you have a bigger vision, I can build it.",
    features: [
      "E-commerce stores",
      "Custom web applications",
      "API integrations",
      "Ongoing maintenance",
      "Priority support",
    ],
    cta: "Book a call",
    highlighted: false,
  },
];

export type Project = {
  name: string;
  domain: string;
  category: string;
  description: string;
  mockupKey: string;
  url: string;
};

export const projects: Project[] = [
  {
    name: "Oakwood Real Estate",
    domain: "oakwoodrealty.com",
    category: "Real Estate · Lead Gen",
    description: "Luxury property listings with immersive photo galleries, mortgage calculator, and a lead capture funnel that tripled inquiries.",
    mockupKey: "oakwood",
    url: "#",
  },
  {
    name: "Luma Skincare",
    domain: "lumaskincare.co",
    category: "Beauty · E-commerce",
    description: "A clean, editorial e-commerce store for a sustainable beauty brand — product pages, subscriptions, and a seamless checkout.",
    mockupKey: "luma",
    url: "#",
  },
  {
    name: "Catalyst Consulting",
    domain: "catalystco.io",
    category: "B2B · Lead Generation",
    description: "High-converting landing pages and a case study hub for a strategy consulting firm, with integrated CRM and calendar booking.",
    mockupKey: "catalyst",
    url: "#",
  },
  {
    name: "Nomad Coffee Co.",
    domain: "nomadcoffee.com",
    category: "Hospitality · Brand Site",
    description: "A warm, story-driven site for a specialty coffee roaster — online ordering, roastery locations, and a coffee subscription box.",
    mockupKey: "nomad",
    url: "#",
  },
  {
    name: "Atlas Fitness",
    domain: "atlasfitness.app",
    category: "Fitness · Membership",
    description: "A dark, energetic site for a boutique gym with class scheduling, trainer profiles, and integrated membership sign-up.",
    mockupKey: "atlas",
    url: "#",
  },
  {
    name: "Horizon Architecture",
    domain: "horizonarch.studio",
    category: "Architecture · Portfolio",
    description: "A minimal, image-forward portfolio for an award-winning architecture studio with full-screen project galleries.",
    mockupKey: "horizon",
    url: "#",
  },
];

export const budgetOptions = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;
