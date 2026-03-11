export const siteConfig = {
  name: "Brian Whirlow",
  tagline: "Web Designer & Developer",
  description:
    "I design and build fast, beautiful websites that help businesses grow. From simple brochure sites to full e-commerce stores — I handle it all.",
  email: "brian@brianwhirlow.com", // TODO: update with real email
  calendlyUrl: "#", // TODO: add Calendly link
  social: {
    github: "#", // TODO: add real links
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
      "Perfect for small businesses or individuals who need a clean, professional online presence fast.",
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
      "Custom design",
      "CMS integration",
      "SEO optimization",
      "Google Analytics setup",
      "3 rounds of revisions",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description:
      "E-commerce, web applications, ongoing retainers — if you have a bigger vision, I can build it.",
    features: [
      "E-commerce stores",
      "Custom web apps",
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
  category: string;
  description: string;
  imageAlt: string;
  url: string;
};

export const projects: Project[] = [
  {
    name: "Maple & Co.",
    category: "Restaurant · Brochure Site",
    description:
      "A warm, inviting site for a local restaurant featuring their menu, story, and online reservation form.",
    imageAlt: "Maple & Co. restaurant website screenshot",
    url: "#", // TODO: replace with real project URL
  },
  {
    name: "Studio Vera",
    category: "Photography · Portfolio",
    description:
      "A minimal, image-forward portfolio for a professional photographer with a full-screen gallery.",
    imageAlt: "Studio Vera photography portfolio screenshot",
    url: "#",
  },
  {
    name: "GreenLeaf Supply",
    category: "E-commerce · Online Store",
    description:
      "A clean e-commerce store for a sustainable goods brand, with product catalog and checkout.",
    imageAlt: "GreenLeaf Supply e-commerce website screenshot",
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
