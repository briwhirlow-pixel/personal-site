export const siteConfig = {
  name: "Brian Whirlow",
  tagline: "Web Designer & Developer",
  description:
    "I design and build fast, beautiful websites that help businesses grow. From simple brochure sites to full e-commerce stores — I handle it all.",
  email: "brianwhirlowbusiness@gmail.com",
  calendlyUrl: "https://calendly.com/brianwhirlowbusiness/30min",
  social: {
    github: "#",
    linkedin: "https://www.linkedin.com/in/bwhirlow/",
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
    description: "Perfect for small businesses who need a clean, professional online presence — fast.",
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "Revisions until you're happy",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "Starting at $1,200",
    description: "For businesses ready to stand out. Custom design, more pages, and the tools to manage your content.",
    features: [
      "Up to 10 pages",
      "Custom design system",
      "CMS integration",
      "SEO optimization",
      "Google Analytics",
      "Revisions until you're happy",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Starting at $3,000",
    description: "E-commerce, web apps, ongoing retainers — if you have a bigger vision, I can build it.",
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

export type WebsiteType = {
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  mockupKey: string;
  emoji: string;
};

export const websiteTypes: WebsiteType[] = [
  {
    name: "E-Commerce Store",
    tagline: "Sell online with confidence",
    description: "Beautiful online stores built to convert browsers into buyers — seamless checkout, product pages, and inventory management.",
    includes: ["Product catalog & collections", "Secure payment processing", "Mobile-first checkout", "Order tracking & confirmations"],
    mockupKey: "ecommerce",
    emoji: "🛍️",
  },
  {
    name: "Portfolio & Personal Brand",
    tagline: "Make a lasting first impression",
    description: "A polished, image-forward site to showcase your work and attract the clients or opportunities you actually want.",
    includes: ["Full-screen project galleries", "About & services pages", "Client inquiry form", "Blog or case study support"],
    mockupKey: "portfolio",
    emoji: "✦",
  },
  {
    name: "Restaurant & Hospitality",
    tagline: "Fill tables and build loyalty",
    description: "Warm, story-driven sites that showcase your menu, ambiance, and make it easy for guests to book a table or order online.",
    includes: ["Menu & specials pages", "Reservation integration", "Location & hours", "Online ordering ready"],
    mockupKey: "restaurant",
    emoji: "🍽️",
  },
  {
    name: "Business & Services",
    tagline: "Convert visitors into clients",
    description: "Professional lead-generation sites for consultants, agencies, and service businesses — built to build trust and capture inquiries.",
    includes: ["Service & pricing pages", "Lead capture forms", "Testimonials & case studies", "Calendar booking integration"],
    mockupKey: "business",
    emoji: "💼",
  },
  {
    name: "Real Estate & Property",
    tagline: "Showcase listings and capture leads",
    description: "Clean, high-converting property sites with immersive photo galleries, search filters, and built-in lead capture.",
    includes: ["Property listing pages", "Search & filter functionality", "Agent bio & contact", "Virtual tour integration"],
    mockupKey: "realestate",
    emoji: "🏡",
  },
  {
    name: "Health, Wellness & Fitness",
    tagline: "Grow your practice or studio",
    description: "Fresh, professional sites for gyms, studios, therapists, and wellness brands — with class schedules, booking, and membership flows.",
    includes: ["Class schedule & booking", "Membership sign-up", "Trainer & practitioner profiles", "Blog & resources"],
    mockupKey: "health",
    emoji: "💪",
  },
];

export const liveProjects = [
  {
    name: "APEX Performance Studio",
    category: "Health, Wellness & Fitness",
    tag: "Fitness Studio",
    description: "Full multi-page fitness studio site — class schedules, trainer profiles, membership pricing, and free trial booking form.",
    url: "https://apex-fitness-navy.vercel.app",
    features: ["6 class types + full schedule", "Trainer profile pages", "3-tier membership pricing", "Free trial booking form"],
    accentColor: "#C8FF00",
    bgFrom: "#060B18",
    bgTo: "#0A1535",
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

export const launchOptions = [
  { label: "2 Weeks", value: "2weeks", weeks: 2 },
  { label: "1 Month", value: "1month", weeks: 4 },
  { label: "3 Months", value: "3months", weeks: 13 },
  { label: "Custom Date", value: "custom", weeks: 0 },
] as const;
