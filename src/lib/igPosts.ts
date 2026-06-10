export type TitleLine = { text: string; italic?: boolean };

export type IGPostData = {
  id: string;
  name: string;
  type: string;
  variant: "studio" | "dark" | "blue" | "cream" | "eagles" | "phillies" | "amber" | "plum" | "ocean" | "citrus" | "swoop" | "phanatic" | "webslinger" | "starter";
  topLeftLabel: string;
  topRightLabel: string;
  kicker: string;
  price?: { v: string; s: string };
  titleLines: TitleLine[];
  sub?: string;
  numList?: { n: string; text: string }[];
  tagRow?: string[];
  subBottom?: string;
  cta: string;
  ctaArrow?: boolean;
  bottomImage?: { src: string; alt: string; tagline?: string; background?: "circle-white"; size?: "logo" | "hero" | "banner" };
  caption: string;
  hashtags: string;
  reelConcept?: string;
  customLayout?: "monitor" | "starter-trio" | "swoop-flex" | "spidey-swing" | "phanatic-hype" | "boardwalk" | "calendar-tile" | "about-designer";
};

export const igPosts: IGPostData[] = [
  {
    id: "00",
    name: "Intro — Hi, I'm Brian (PIN this one)",
    type: "Single image · Introduction · Pin First",
    variant: "blue",
    topLeftLabel: "INTRODUCING / 000",
    topRightLabel: "FIRST POST",
    kicker: "HEY THERE",
    titleLines: [
      { text: "Hi. I'm Brian." },
      { text: "I hand-build" },
      { text: "websites.", italic: true },
    ],
    sub: "One person. South Jersey / Philly based. Custom sites for restaurants, studios, shops, and service businesses. Own the code, or have BuiltbyBrian Web Design host it for you.",
    tagRow: ["5-DAY DRAFT", "PHILLY + SJ", "OWN OR HOST", "5.0 RATING"],
    cta: "Follow for builds",
    customLayout: "monitor",
    caption: `Hi — I'm Brian. 👋

This is BuiltbyBrian. A one-person web design studio out of South Jersey + Philadelphia.

I hand-build custom websites for local small businesses — restaurants, studios, shops, service businesses. No templates. No Wix overlords.

Your call after launch:
→ Take the code. Host it yourself. You own it forever.
→ Or let me handle hosting, SSL, backups, edits — care plans from $49/mo.

Either way, it's your website. Your call.

What you'll see on this feed:
→ Site builds in progress
→ Before/afters of client launches
→ Tips for small business owners who actually want their site to work
→ Behind-the-scenes of the studio

If you've been putting off your website for "next quarter" — let's chat. Free 30-min discovery call, link in bio.

Tap follow, hang out. Good to meet you.`,
    hashtags:
      "#PhillySmallBusiness #SouthJerseyBusiness #PhillyBusiness #PhillyEntrepreneur #WebDesignerPhiladelphia #FreelanceWebDesigner #SmallBusinessOwner #BuiltByBrian #FreelanceLife #BuiltByBwhirl",
  },
  {
    id: "01",
    name: "What $750 actually gets you",
    type: "Carousel · 6 slides · Direct Offer",
    variant: "studio",
    topLeftLabel: "BUILTBYBRIAN · STARTER",
    topRightLabel: "01 / 06",
    kicker: "TIER 01 · ONE-TIME",
    price: { v: "$750", s: "+" },
    titleLines: [{ text: "A real website," }, { text: "hand-built.", italic: true }],
    sub: "Up to 5 pages · Mobile-first · Contact form · Basic SEO · 2 rounds of revisions · Code is yours forever.",
    tagRow: ["NEXT.JS", "REACT", "VERCEL READY"],
    cta: "Swipe",
    ctaArrow: true,
    caption: `Hand-built. Mobile-first. Yours forever.

Most "cheap" websites today are dragged-and-dropped templates that fight you the second you want to grow. Here's what $750 actually buys when a real developer hand-builds it for you 👇

✓ Up to 5 custom pages
✓ Mobile-first, tested on every screen
✓ Contact form wired to your inbox
✓ Basic SEO so Google can actually find you
✓ 2 rounds of revisions
✓ Full source code — you own it forever

No subscriptions. No Wix overlords. Just a real website that works.

Booked 1 project this month. DM "Starter" or tap the link in bio to lock yours in.`,
    hashtags:
      "#PhillySmallBusiness #SmallBusinessOwner #WebDesignerPhiladelphia #SouthJerseyBusiness #FreelanceWebDesigner #SmallBusinessMarketing #BuiltByBrian #WebDesignTips #PhillyBusiness #BuiltByBwhirl",
  },
  {
    id: "02",
    name: "5 signs your restaurant site is killing reservations",
    type: "Carousel · 7 slides · Education",
    variant: "dark",
    topLeftLabel: "NICHE · RESTAURANTS",
    topRightLabel: "01 / 07",
    kicker: "SAVE THIS FOR LATER",
    titleLines: [
      { text: "5 silent killers" },
      { text: "on your" },
      { text: "menu page.", italic: true },
    ],
    sub: "Your food is great. Your website is sending people to the spot next door.",
    numList: [
      { n: "1", text: "Menu is a PDF" },
      { n: "2", text: "Phone isn't tap-to-call" },
      { n: "3", text: "No reservation above fold" },
      { n: "4", text: "Slow on 4G" },
      { n: "5", text: "Hours buried 3 clicks deep" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `Your menu is great. Your website is sending people to the spot next door.

5 silent killers I see on almost every restaurant site in Philly 👇

1. Menu is a PDF (mobile = 🥲)
2. Phone number isn't tap-to-call
3. No reservation link above the fold
4. Slow loading on 4G
5. Hours buried 3 clicks deep

Fix any one and you'll feel it this weekend.

I build hospitality sites that fill tables, not just look pretty. Comment "MENU" and I'll send you the 1-page checklist I use before launch.`,
    hashtags:
      "#PhillyRestaurants #PhillyFood #RestaurantMarketing #SmallBusinessOwner #PhillyEats #FoodieOfPhilly #RestaurantWebsite #WebDesigner #PhillySmallBiz #BuiltByBrian",
  },
  {
    id: "03",
    name: "APEX Performance Studio launch reveal",
    type: "Carousel · 5 slides · Proof · Reveal",
    variant: "blue",
    topLeftLabel: "NEW LAUNCH · FITNESS",
    topRightLabel: "01 / 05",
    kicker: "JUST SHIPPED",
    titleLines: [
      { text: "APEX" },
      { text: "Performance" },
      { text: "Studio.", italic: true },
    ],
    sub: "Multi-page fitness studio site — schedules, trainer profiles, 3-tier membership pricing, free trial booking form.",
    tagRow: ["SCHEDULE", "TRAINERS", "MEMBERSHIPS", "BOOKINGS"],
    cta: "Live link in bio",
    ctaArrow: true,
    caption: `Just launched: APEX Performance Studio.

A multi-page fitness studio site — 6 class types with a full schedule, trainer profile pages, 3-tier membership pricing, and a free trial booking form that drops leads straight into the inbox.

Built clean. Built custom. Built to convert.

Live link in bio. Swipe to see the pages →

If you run a studio, a gym, or a wellness brand and your website is still stuck in 2019 — let's talk. One slot left this month.`,
    hashtags:
      "#FitnessStudio #GymOwner #PhillyFitness #WebDesigner #FreelanceDeveloper #SmallBusinessMarketing #StudioOwner #FitnessMarketing #BuiltByBrian #PhillyBusiness",
  },
  {
    id: "04",
    name: "Your website doesn't need 50 pages",
    type: "Single image · Hot Take",
    variant: "cream",
    topLeftLabel: "HOT TAKE / 004",
    topRightLabel: "SAVE THIS",
    kicker: "FRIENDLY REMINDER",
    titleLines: [
      { text: "Your site" },
      { text: "doesn't need" },
      { text: "to be 50 pages.", italic: true },
    ],
    sub: "You need 5 pages that work. Home. Services. About. Proof. Contact. Anything more is procrastination disguised as planning.",
    cta: "@builtbybwhirl",
    caption: `Hot take: your small business doesn't need 50 pages.

You need 5 pages that work.

→ A homepage that answers "what do you do?" in 3 seconds
→ A services page that doesn't make people scroll forever
→ An about page with a real photo of a real person
→ A portfolio/menu/proof page
→ A contact page where the form actually submits

Stop paying for what you don't need. Stop "planning" what you should be shipping.

If your current site is 30+ pages of nobody-reads-this — DM me. I'll show you what 5 great pages looks like.`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #PhillyBusiness #WebDesigner #FreelanceWebDesigner #MarketingTips #BuiltByBrian #SmallBusinessTips #WebDesign",
  },
  {
    id: "05",
    name: "The $16/month math nobody talks about",
    type: "Carousel · 6 slides · Education",
    variant: "dark",
    topLeftLabel: "RECEIPTS / 005",
    topRightLabel: "01 / 06",
    kicker: "THE MATH",
    titleLines: [
      { text: '"$16 a month."' },
      { text: "For how long?", italic: true },
    ],
    sub: "Wix Premium runs $16-49/mo. Forever. Plus plugin fees, domain renewals — and you still don't own the code.",
    numList: [
      { n: "1Y", text: "$192 – $588 to rent" },
      { n: "3Y", text: "$576 – $1,764" },
      { n: "5Y", text: "$960 – $2,940" },
    ],
    subBottom: "Custom from me, one time: $750–$1,200. Code in your hand.",
    cta: "Swipe for breakdown",
    ctaArrow: true,
    caption: `The "$16/month website" math nobody talks about 💸

Wix / Squarespace Premium: $16-49/mo → $192-588/year
Templates everyone uses: $0 but your brand looks like everyone else's
Hidden domain renewals + plugin fees: another $50-200/year
And you still don't own the code.

Custom from me, one time: $750-$1,200, code in your hand.

Year 1 of Wix = Year 5 of subscription rot.

If you've been waiting to "do this right," this is the year. Drop a 🛠 and I'll DM you my Starter or Professional breakdown.`,
    hashtags:
      "#SmallBusinessOwner #WebDesign #WixVsCustom #SquarespaceVsCustom #PhillyBusiness #WebDesigner #SmallBusinessTips #BuiltByBrian #PhillySmallBiz",
  },
  {
    id: "06",
    name: "POV: hiring a one-person studio (Reel)",
    type: "Reel · 15–25 sec · Build in Public",
    variant: "blue",
    topLeftLabel: "REEL · POV",
    topRightLabel: "WATCH",
    kicker: "YOU TEXT. I ANSWER.",
    titleLines: [
      { text: "You hire a" },
      { text: "one-person studio.", italic: true },
    ],
    sub: "No PM forwarding your message to the junior. Just the person building it, replying to you in hours.",
    tagRow: ["FIRST DRAFT IN 5 DAYS", "LAUNCH IN 2–4 WEEKS"],
    cta: "Watch the reel",
    caption: `POV: you hire a one-person studio instead of an agency.

→ You text the designer. The designer answers.
→ No account manager forwarding your texts to a project manager forwarding them to a junior designer.
→ Decisions in hours, not weeks.
→ First draft in 5 days.

This is how 5-star projects get shipped.

If you're done playing telephone with agencies — let's talk. 30-min discovery call, link in bio.`,
    hashtags:
      "#WebDesigner #FreelanceLife #FreelanceDeveloper #SmallBusinessMarketing #PhillyDesigner #BuiltByBrian #FreelanceWebDesigner #SmallBusinessOwner",
    reelConcept:
      "Split screen. LEFT: 'AGENCY' — corporate stock footage of meetings, then a phone showing 'We'll get back to you next Tuesday.' RIGHT: 'BRIAN' — you at your desk, screen recording of replying to a client text within an hour, Figma frames flying by. Closing card: 'Built by Brian. One person. Start to finish.' Trending lo-fi or boom-bap audio.",
  },
  {
    id: "07",
    name: "5 days, blank page to first draft",
    type: "Carousel · 6 slides · Build in Public",
    variant: "cream",
    topLeftLabel: "THE PROCESS / 007",
    topRightLabel: "01 / 06",
    kicker: "5 DAYS · BLANK PAGE TO DRAFT",
    titleLines: [
      { text: "Day 01" },
      { text: "to" },
      { text: "Day 05.", italic: true },
    ],
    numList: [
      { n: "1", text: "Kickoff — too many questions on purpose" },
      { n: "2", text: "Copy + sitemap. Words before pixels." },
      { n: "3", text: "Design system — type, color, components" },
      { n: "4", text: "Build. Real code, not a template." },
      { n: "5", text: "First draft in your inbox." },
    ],
    cta: "Process",
    ctaArrow: true,
    caption: `Day 1: kickoff call. I ask too many questions on purpose.
Day 2: copy + sitemap. Words before pixels.
Day 3: design system — type, color, components.
Day 4: build it. Real code, not a template.
Day 5: first draft in your inbox.

You give feedback. We revise. You launch.

This is what 5 years of doing this gets you.

If you've been told "websites take 3 months" — they don't. Not when one person owns the whole thing.`,
    hashtags:
      "#WebDesignProcess #BehindTheScenes #FreelanceDeveloper #SmallBusinessOwner #WebDesigner #PhillyDesigner #BuiltByBrian #WebDesign",
  },
  {
    id: "08",
    name: "3 things every Philly homepage needs",
    type: "Carousel · 5 slides · Education · Local",
    variant: "studio",
    topLeftLabel: "PHILLY HOMEPAGE / 008",
    topRightLabel: "01 / 05",
    kicker: "PHILA",
    titleLines: [
      { text: "3 things" },
      { text: "every homepage" },
      { text: "needs.", italic: true },
    ],
    numList: [
      { n: "1", text: '"We help WHO do WHAT" headline above the fold' },
      { n: "2", text: "Proof in the first 5 seconds (photo, review, number)" },
      { n: "3", text: "ONE next action. Not five." },
    ],
    cta: "Save",
    ctaArrow: true,
    caption: `After 5 years building sites for Philly businesses, these 3 things show up on every homepage that actually converts 👇

1. A clear "we help [WHO] do [WHAT]" headline. Above the fold. No ambiguity.

2. A reason to trust you in the first 5 seconds — a real photo, a review, a number, anything human.

3. One single next action. Not "book OR call OR email OR newsletter signup." Pick one. Make it big.

Save this for when you're ready to refresh yours.`,
    hashtags:
      "#PhillyBusiness #SmallBusinessTips #WebDesignTips #MarketingTips #SmallBusinessOwner #WebDesigner #PhillySmallBusiness #BuiltByBrian",
  },
  {
    id: "09",
    name: "Why I started this studio",
    type: "Single + photo · Founder",
    variant: "studio",
    topLeftLabel: "FOUNDER / 009",
    topRightLabel: "PIN",
    kicker: "HELLO — I'M BRIAN",
    titleLines: [
      { text: "5 years" },
      { text: "of building" },
      { text: "for local.", italic: true },
    ],
    sub: "Designer + developer. Philly. Restaurants, studios, shops, service businesses. One person, start to finish.",
    tagRow: ["MIS DEGREE", "MBA · SUSTAINABLE BIZ", "5.0 RATING"],
    cta: "Discovery call · bio",
    caption: `5 years ago I built my first website for a friend's small business.

A week later they sent me a screenshot of a booking that came in from Google.

That feeling — building something real for a real person who needed it — never left.

Today I run BuiltbyBrian out of Philly. One person, start to finish, for restaurants, studios, shops, and service businesses across the region. I've got a degree in Management Information Systems and I'm finishing my MBA in Sustainable Business right now.

If you've been putting off your website because it felt overwhelming — I built this studio for you specifically.

Discovery calls are free, 30 minutes, no hard sell. Link in bio.`,
    hashtags:
      "#FounderStory #SmallBusinessOwner #PhillyBusiness #WebDesigner #FreelanceLife #BuiltByBrian #FreelanceDeveloper #PhillyEntrepreneur",
  },
  {
    id: "10",
    name: "Where does $1,200 actually go?",
    type: "Carousel · 7 slides · Education · Pricing",
    variant: "studio",
    topLeftLabel: "TRANSPARENT PRICING",
    topRightLabel: "01 / 07",
    kicker: "TIER 02 · PROFESSIONAL",
    price: { v: "$1,200", s: "+" },
    titleLines: [
      { text: "Where does" },
      { text: "the money go?", italic: true },
    ],
    numList: [
      { n: "1", text: "Discovery + strategy" },
      { n: "2", text: "Custom design system" },
      { n: "3", text: "10 pages of hand-written code" },
      { n: "4", text: "CMS, SEO, analytics" },
      { n: "5", text: "2 rounds of revisions" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `Where does $1,200 actually go on a Professional-tier website? 💰

Slide 1: Discovery + strategy — the call where I ask too many questions on purpose
Slide 2: Custom design system — type, color, components built for YOUR brand
Slide 3: Build — up to 10 pages of clean, hand-written code
Slide 4: CMS so you can update content without calling me
Slide 5: SEO + analytics so you can actually measure what's working
Slide 6: 2 rounds of revisions baked in

That's a website that pays for itself the first time a new client books from it.

Transparent pricing on the site — no surprise estimates, no "depends on scope." Link in bio.`,
    hashtags:
      "#WebDesignPricing #SmallBusinessOwner #WebDesigner #PhillyBusiness #FreelanceDeveloper #PricingTransparency #BuiltByBrian #WebDesignTips",
  },
  {
    id: "11",
    name: "1 build slot open",
    type: "Single image · Direct Offer",
    variant: "blue",
    topLeftLabel: "ACCEPTING · 1 SLOT",
    topRightLabel: "THIS MONTH",
    kicker: "🟢 OPEN",
    titleLines: [
      { text: "1 build slot." },
      { text: "This month.", italic: true },
    ],
    sub: "5-day first draft. 2-4 week delivery. Code is yours forever. First deposit locks the slot.",
    tagRow: ["STARTER · $750+", "PRO · $1,200+", "CUSTOM · $3,000+"],
    cta: 'DM "SLOT"',
    caption: `🟢 1 build slot open this month.

If you've been "meaning to redo the website all year" — this is your reminder.

5-day first draft. 2-4 week delivery. Code is yours forever.

DM "SLOT" or tap the link in bio to book a free 30-min discovery call.

(Slot fills first-come, first-deposit. No hard sell on the call — just see if we're a fit.)`,
    hashtags:
      "#PhillyBusiness #WebDesigner #SmallBusinessOwner #FreelanceWebDesigner #BuiltByBrian #PhillySmallBusiness #WebDesignerPhiladelphia",
  },
  {
    id: "12",
    name: "5 things to delete from your homepage",
    type: "Carousel · 6 slides · Education",
    variant: "dark",
    topLeftLabel: "STOP DOING THIS / 012",
    topRightLabel: "01 / 06",
    kicker: "REMOVE TODAY",
    titleLines: [
      { text: "5 things to" },
      { text: "delete from your" },
      { text: "homepage.", italic: true },
    ],
    numList: [
      { n: "1", text: "Auto-playing video that crashes phones" },
      { n: "2", text: "6-slide hero carousel (nobody waits)" },
      { n: "3", text: "Lorem ipsum you forgot to replace" },
      { n: "4", text: "Forms asking for 11 fields" },
      { n: "5", text: "Pop-ups firing before scroll" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `5 things I beg you to remove from your homepage 🛑

1. The auto-playing video that crashes phones
2. The 6-slide hero carousel (people stop after slide 1)
3. "Lorem ipsum" you forgot to replace (yes, I still see this)
4. The contact form that asks for 11 fields
5. Pop-ups that fire before someone reads a single word

Each one of these costs you customers daily.

If your site has any of these — comment "AUDIT" and I'll do a free 5-minute teardown in your DMs.`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #MarketingTips #PhillyBusiness #WebDesigner #UXTips #BuiltByBrian #SmallBusinessTips",
  },
  {
    id: "13",
    name: "The 30-second tap-to-call fix",
    type: "Single image · Quick Win",
    variant: "cream",
    topLeftLabel: "QUICK FIX / 013",
    topRightLabel: "30 SECONDS",
    kicker: "FREE TIP",
    titleLines: [
      { text: "Make your" },
      { text: "phone number" },
      { text: "tap-to-call.", italic: true },
    ],
    sub: "On every page. In the header. At the bottom. In the contact section. Mobile users won't long-press to copy. They'll just go elsewhere.",
    tagRow: ["RESTAURANT", "SALON", "SERVICES"],
    cta: "@builtbybwhirl",
    caption: `30-second fix for any restaurant, salon, or service business website:

Make your phone number tap-to-call.

On every page. In the header. At the bottom. In the contact section.

Mobile users won't long-press to copy. They'll just go elsewhere.

It's a one-line code change. Send this to your web person.

(Don't have one? You know where to find me.)`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #RestaurantMarketing #LocalBusiness #PhillyBusiness #MobileWeb #WebDesigner #BuiltByBrian",
  },
  {
    id: "14",
    name: "I don't use templates. Here's why.",
    type: "Carousel · 6 slides · Positioning",
    variant: "studio",
    topLeftLabel: "NO TEMPLATES / 014",
    topRightLabel: "01 / 06",
    kicker: "THE WHOLE POINT",
    titleLines: [
      { text: "I don't" },
      { text: "use templates.", italic: true },
      { text: "Ever." },
    ],
    numList: [
      { n: "01", text: "Templates assume you're generic. You aren't." },
      { n: "02", text: "You inherit their design debt" },
      { n: "03", text: "Migration always costs more" },
      { n: "04", text: "Your competitors look just like you" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `Why no templates. Ever.

1. Templates assume your business is generic. It isn't.

2. They lock you into someone else's design decisions — and someone else's design debt.

3. Every "easy" template I've ever migrated a client off of cost more in cleanup than the original build would have.

4. Your competitors are using the same 5 templates. You'll look like them. You don't want to look like them.

5. Hand-built means custom — for your customer, your story, your goals.

Hand-built is the whole point.`,
    hashtags:
      "#WebDesigner #CustomWebDesign #FreelanceDeveloper #SmallBusinessOwner #PhillyBusiness #BuiltByBrian #WebDesign",
  },
  {
    id: "15",
    name: '"How long will it take?" (Reel)',
    type: "Reel · 20–30 sec · Build in Public",
    variant: "dark",
    topLeftLabel: "REEL · TIMELINE",
    topRightLabel: "WATCH",
    kicker: "TIMELINE",
    titleLines: [
      { text: '"How long' },
      { text: 'will it take?"', italic: true },
    ],
    numList: [
      { n: "D1", text: "Kickoff call" },
      { n: "D5", text: "First draft" },
      { n: "W2", text: "Revisions" },
      { n: "W3", text: "Launch" },
    ],
    cta: "Watch the reel",
    caption: `"How long will it take?"

Day 1: kickoff
Day 5: first draft
Week 2: revisions
Week 3-4: launch 🚀

That's it. Most local businesses are 2-4 weeks away from a website that finally feels like them.

Stop scoping it for "next quarter." Start scoping it for "next month."`,
    hashtags:
      "#WebDesignProcess #FreelanceDeveloper #SmallBusinessOwner #WebDesigner #BuiltByBrian #WebDesignTips",
    reelConcept:
      "Time-lapse vibe. Each line of the timeline cuts to a real moment: kickoff call (your laptop on a desk), Figma frames flying through, terminal/deploy log scrolling, the live site loading on a phone. 25 seconds. Add captions on every cut.",
  },
  {
    id: "16",
    name: "Things I include for free",
    type: "Carousel · 5 slides · Value Stack",
    variant: "studio",
    topLeftLabel: "NO UPCHARGE / 016",
    topRightLabel: "01 / 05",
    kicker: "INCLUDED · EVERY TIER",
    titleLines: [
      { text: "Things I" },
      { text: "include for free.", italic: true },
    ],
    numList: [
      { n: "✓", text: "Mobile-first design, tested every screen" },
      { n: "✓", text: "Basic SEO setup" },
      { n: "✓", text: "Source code handoff — you own it" },
      { n: "✓", text: "Host setup (Vercel, Netlify)" },
      { n: "✓", text: "30-min training call" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `Stuff baked into every project — no upcharge 🎁

→ Mobile-first design (literally every screen tested)
→ Basic SEO setup so Google can index it
→ Source code handoff (you own everything)
→ Setup on the host of your choice (Vercel, Netlify, etc.)
→ 2 rounds of revisions
→ A 30-min training call so you can update content yourself

I'm not building this to nickel-and-dime you. I'm building it so it works.

Tap the bio if you want to see the full breakdown.`,
    hashtags:
      "#WebDesigner #FreelanceDeveloper #SmallBusinessOwner #PhillyBusiness #WebDesign #BuiltByBrian #SmallBusinessTips",
  },
  {
    id: "17",
    name: 'Your website isn\'t a "digital business card"',
    type: "Single image · Hot Take",
    variant: "blue",
    topLeftLabel: "SHIFT THE FRAME / 017",
    topRightLabel: "HOT TAKE",
    kicker: "REFRAME",
    titleLines: [
      { text: "Your website" },
      { text: "isn't a digital" },
      { text: "business card.", italic: true },
    ],
    sub: "It's the only employee that works for you 24/7, never calls out, and closes deals while you sleep.",
    tagRow: ["STOP TREATING IT LIKE OVERHEAD"],
    cta: "@builtbybwhirl",
    caption: `Your website isn't a "digital business card."

It's the only employee that works for you 24/7, never calls out, and closes deals while you sleep.

Stop treating it like overhead.
Start treating it like your best salesperson.

If yours isn't pulling its weight — tap the bio. Free 30-min audit call.`,
    hashtags:
      "#SmallBusinessOwner #WebDesign #MarketingTips #PhillyBusiness #WebDesigner #BuiltByBrian #SmallBusinessTips",
  },
  {
    id: "18",
    name: "The hidden cost of a slow website",
    type: "Carousel · 5 slides · Education · Tech",
    variant: "dark",
    topLeftLabel: "PAGE SPEED / 018",
    topRightLabel: "01 / 05",
    kicker: "GOOGLE'S NUMBER · NOT MINE",
    titleLines: [
      { text: "1 second" },
      { text: "= a 7% drop", italic: true },
      { text: "in conversions." },
    ],
    sub: "A 4-second site is leaving roughly 28% of leads on the table. Bloated themes, scripts, autoplay video, unoptimized images.",
    cta: "Swipe",
    ctaArrow: true,
    caption: `Every 1 second of load time = roughly 7% drop in conversions (Google's number, not mine).

Translation: a 4-second site is leaving ~28% of leads on the table.

What slows sites down 👇
→ Massive unoptimized images
→ 10 marketing scripts firing at once
→ Auto-playing video on the homepage
→ A theme stacked with plugins you don't use

I build everything custom and lean from day one. Fast by default, not as an upgrade.

If you don't know your site's speed, run it through Google PageSpeed Insights right now. Then DM me the score. We'll go from there.`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #MarketingTips #PageSpeed #WebDesigner #SEO #PhillyBusiness #BuiltByBrian",
  },
  {
    id: "19",
    name: "Open for restaurants this month",
    type: "Single image · Niche Offer",
    variant: "cream",
    topLeftLabel: "HOSPITALITY · 1 SLOT",
    topRightLabel: "THIS MONTH",
    kicker: "RESTAURANTS",
    titleLines: [
      { text: "1 slot. This" },
      { text: "month. For a" },
      { text: "restaurant.", italic: true },
    ],
    sub: "Menu pages that don't break on mobile. Reservation links that convert. Photo galleries that make people hungry.",
    tagRow: ["PHILA"],
    cta: 'DM "MENU"',
    caption: `Restaurants — I have 1 slot this month specifically for hospitality.

Menu pages that don't break on mobile. Reservation links that actually convert. Photo galleries that make people hungry.

If you're tired of explaining to customers where the menu lives — let's fix it.

Free 30-min call to scope it out. DM "MENU" or tap the link in bio.`,
    hashtags:
      "#PhillyRestaurants #RestaurantOwner #PhillyFood #FoodieOfPhilly #RestaurantMarketing #WebDesigner #BuiltByBrian #PhillyEats",
  },
  {
    id: "20",
    name: "After launch, your options",
    type: "Carousel · 6 slides · Care Plans",
    variant: "studio",
    topLeftLabel: "AFTER LAUNCH / 020",
    topRightLabel: "01 / 06",
    kicker: "YOUR CHOICE",
    titleLines: [
      { text: "Two paths" },
      { text: "after we hit" },
      { text: "publish.", italic: true },
    ],
    numList: [
      { n: "A", text: "Take your files. Host anywhere. One-time cost." },
      { n: "B", text: "I manage it — $49 · $99 · $149 / mo" },
    ],
    subBottom: "Cancel anytime. Pay yearly, save 2 months.",
    cta: "Swipe",
    ctaArrow: true,
    caption: `After you launch — you have options 🛠️

🅰️ Take your files. Full source code, host anywhere. One-time cost. Done.

🅱️ Let me host it for you:
• Basic — $49/mo (hosting, SSL, backups, monitoring)
• Starter — $99/mo (+ 1 hr edits/month + priority support)
• Growth — $149/mo (+ 2 hrs edits + monthly SEO report)

Cancel anytime. Pay yearly, save 2 months.

The choice is always yours. That's the whole point.`,
    hashtags:
      "#WebDesigner #SmallBusinessOwner #PhillyBusiness #WebHosting #FreelanceDeveloper #BuiltByBrian #WebDesignTips",
  },
  {
    id: "21",
    name: "What's under the hood",
    type: "Carousel · 5 slides · Credibility",
    variant: "dark",
    topLeftLabel: "UNDER THE HOOD / 021",
    topRightLabel: "01 / 05",
    kicker: "THE STACK",
    titleLines: [
      { text: "Enterprise tools." },
      { text: "Small-biz pricing.", italic: true },
    ],
    tagRow: ["NEXT.JS", "REACT", "TYPESCRIPT", "TAILWIND", "VERCEL", "SUPABASE", "SHOPIFY"],
    subBottom: "Same framework Hulu, TikTok, and Notion use. Built lean. Hosted on a stack that auto-scales.",
    cta: "Swipe",
    ctaArrow: true,
    caption: `What's under the hood when I build you a site:

→ Next.js + React (the same framework Hulu, TikTok, and Notion use)
→ TypeScript (so bugs get caught before they ship)
→ Tailwind for design system consistency
→ Vercel for hosting that auto-scales
→ Supabase or Shopify when you need a backend

Translation: enterprise-grade tools, small-business pricing.

When you outgrow your starter site, you don't have to rip it down and start over. The foundation scales with you.`,
    hashtags:
      "#WebDeveloper #NextJS #React #TypeScript #FreelanceDeveloper #WebDesigner #SmallBusinessOwner #BuiltByBrian",
  },
  {
    id: "22",
    name: "Built in Philly · Go Birds",
    type: "Single image · Local · Eagles Pride",
    variant: "eagles",
    topLeftLabel: "HOMETOWN / 022",
    topRightLabel: "PHILA",
    kicker: "FOR THE CITY",
    titleLines: [
      { text: "Built in Philly." },
      { text: "Go birds.", italic: true },
    ],
    sub: "Local businesses keep this city alive. Yours deserves a website that does the same.",
    bottomImage: {
      src: "/images/eagles-logo.png",
      alt: "Philadelphia Eagles",
      tagline: "FLY · EAGLES · FLY",
    },
    cta: "@builtbybwhirl",
    caption: `Built in Philly. Built for Philly. 🦅

Go birds.

Local businesses are what keep this city alive. Yours deserves a website that does the same — fast, custom, made by someone who actually walks these streets.

If you're a Philly small business owner reading this — drop a 🦅 in the comments. I'll send you my "Philly small business homepage checklist" in your DMs.

Fly Eagles fly.`,
    hashtags:
      "#PhillySmallBusiness #PhillyBusiness #ShopLocal #PhillyMade #WebDesignerPhiladelphia #PhillyEntrepreneur #BuiltByBrian #GoBirds #FlyEaglesFly #PhillySmallBiz",
  },
  {
    id: "23",
    name: "Built in Philly · Ring the Bell",
    type: "Single image · Local · Phillies Pride",
    variant: "phillies",
    topLeftLabel: "RING THE BELL / 023",
    topRightLabel: "PHILA",
    kicker: "FOR THE CITY",
    titleLines: [
      { text: "Built in Philly." },
      { text: "Ring the bell.", italic: true },
    ],
    sub: "Built for the city that brings the noise. Your website should hit just as loud.",
    bottomImage: {
      src: "/images/phillies-logo.png",
      alt: "Philadelphia Phillies",
      tagline: "RING · THE · BELL",
      background: "circle-white",
    },
    cta: "@builtbybwhirl",
    caption: `Built in Philly. Built for Philly. 🔔

Ring the bell.

Local businesses are what keep this city loud. Yours deserves a website that does the same — fast, custom, and made by someone who actually walks these streets.

Red October never stopped. Let's build something worth ringing the bell for.

If you're a Philly small business owner reading this — drop a 🔔 in the comments. I'll send you my "Philly small business homepage checklist" in your DMs.

Atta babe.`,
    hashtags:
      "#PhillySmallBusiness #PhillyBusiness #Phillies #RingTheBell #RedOctober #ShopLocal #PhillyMade #WebDesignerPhiladelphia #PhillyEntrepreneur #BuiltByBrian #PhillySmallBiz #GoPhils",
  },
  {
    id: "24",
    name: "FAQ: Do I really need a website?",
    type: "Single image · FAQ · Education",
    variant: "amber",
    topLeftLabel: "FAQ / 024",
    topRightLabel: "Q + A",
    kicker: "MOST ASKED",
    titleLines: [
      { text: "Do I really" },
      { text: "need a" },
      { text: "website?", italic: true },
    ],
    sub: "If most of your customers Google you before they call, and you don't show up — they're calling someone who does.",
    tagRow: ["YES, YOU DO", "FIX IT NOW"],
    cta: 'DM "AUDIT"',
    caption: `FAQ I get at least once a week: "Brian, do I really need a website?"

Short answer: yes. Here's why 👇

Most customers Google a business before they call. If you're not showing up, you're invisible to half your potential market.

A Facebook page is not a website — it's a property you don't own. Yelp can delete you. Google can change the rules.

What a real website does that nothing else can:
✓ Shows up when people search you
✓ Captures leads while you sleep
✓ Builds trust before you ever meet
✓ Gives you full control over your story

If you're still on the fence — DM "AUDIT" and I'll tell you straight if you need one. (Sometimes you don't — that's free advice.)

But for 95% of local businesses? Yes. You do.`,
    hashtags:
      "#SmallBusinessOwner #WebDesignTips #PhillyBusiness #WebDesigner #SmallBusinessMarketing #BuiltByBrian #FAQ #LocalBusiness #PhillySmallBusiness #SouthJerseyBusiness",
  },
  {
    id: "25",
    name: "I'd rather build for 10 locals",
    type: "Single image · Philosophy · Local",
    variant: "plum",
    topLeftLabel: "FOR THE NEIGHBORHOOD / 025",
    topRightLabel: "PHILOSOPHY",
    kicker: "MY TAKE",
    titleLines: [
      { text: "I'd rather build" },
      { text: "for 10 locals" },
      { text: "than a giant.", italic: true },
    ],
    sub: "Local owners care. They show up. They tell their friends. Big enterprise is meetings about meetings. I'll take the corner store every time.",
    tagRow: ["BY LOCAL", "FOR LOCAL"],
    cta: "Work with me",
    caption: `Real talk:

I'd rather build a beautiful website for 10 local Philly + SJ businesses than work on one Fortune 500 corporate project.

Local owners care. They show up. They reply to your DMs. They tell their friends.

Big enterprise is meetings about meetings. Approvals on approvals. Designs by committee until everyone's just kind of fine with what got built.

That's not the game I want to play.

I want to build the website for the corner store you drive past every day. The restaurant that knows your kid's name. The studio you trained at when you started taking your goals seriously.

Local is where the magic is. Local is what I'm here for.

If you run a small business in Philly + SJ — let's talk.`,
    hashtags:
      "#SmallBusinessOwner #PhillyBusiness #SouthJerseyBusiness #ShopLocal #FreelanceLife #PhillyEntrepreneur #BuiltByBrian #LocalBusiness #PhillyMade #PhillySmallBiz",
  },
  {
    id: "26",
    name: "Summer at the Shore — built for the boardwalk",
    type: "Single image · Seasonal · Hospitality",
    variant: "ocean",
    topLeftLabel: "SUMMER '26 / 026",
    topRightLabel: "SHORE SEASON",
    kicker: "JUNE — AUGUST",
    titleLines: [
      { text: "Your customers" },
      { text: "are on the" },
      { text: "boardwalk.", italic: true },
    ],
    sub: "Your site loads in 1.8 seconds on hotel Wi-Fi. Or it doesn't. Mobile-first sites for shore restaurants, rentals, boutiques, and bars.",
    tagRow: ["LBI", "OCNJ", "AVALON", "STONE HARBOR", "WILDWOOD"],
    customLayout: "boardwalk",
    cta: "DM \"SHORE\"",
    caption: `Summer at the shore. Customers are on the boardwalk. ☀️

Your beach-block restaurant. Your rental house. Your boutique three blocks off the bay.

If your site takes 6 seconds to load on hotel Wi-Fi, you just lost a $200 reservation to the spot down the strip.

I build mobile-first shore sites that load in under 2 seconds — tap-to-call, tap-to-reserve, photos that load even when the cell signal doesn't.

Three slots open for shore businesses, June–August launches.

DM "SHORE" or tap the link in bio. We'll have you live before the Fourth.`,
    hashtags:
      "#JerseyShore #LBI #OceanCity #Avalon #StoneHarbor #Wildwood #SouthJerseyBusiness #ShoreBusiness #SummerMarketing #WebDesignerPhiladelphia #BuiltByBrian #PhillySmallBusiness",
  },
  {
    id: "27",
    name: "The summer slowdown that isn't",
    type: "Carousel · 5 slides · Education · Seasonal",
    variant: "citrus",
    topLeftLabel: "SUMMER MATH / 027",
    topRightLabel: "01 / 05",
    kicker: "QUICK MATH · JUNE",
    titleLines: [
      { text: "Slow sites" },
      { text: "lose summer.", italic: true },
    ],
    sub: "Summer traffic peaks Friday 4 PM, Sunday 11 AM, and every rainy Tuesday. Your site has to be ready for the spike — not just for the schedule.",
    numList: [
      { n: "1", text: "4G beats 5G on most boardwalks" },
      { n: "2", text: "Half your summer leads are on a phone in line for coffee" },
      { n: "3", text: "A 4-second site loses 28% of them" },
      { n: "4", text: "Compressed images = same look, half the wait" },
      { n: "5", text: "Reservation link should be one tap from anywhere" },
    ],
    cta: "Swipe",
    ctaArrow: true,
    caption: `The summer slowdown that isn't.

You think bookings drop in July because "everyone's at the shore."

Maybe. But your site might be the one that's dropping them.

→ Summer traffic peaks on Friday afternoons and rainy weekday mornings
→ Half those visitors are on a phone, on 4G, in line somewhere
→ A 4-second load time loses ~28% of them before they ever see your menu

Compressed images, lazy-loaded photos, one-tap reservation links. The summer-site checklist nobody bothers with — but the difference between a packed Saturday and an empty one is right there.

DM "SUMMER" for the 1-page audit I send shore + city clients before peak season.`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #SummerBusiness #JerseyShore #PhillyBusiness #SmallBusinessMarketing #BuiltByBrian #SiteSpeed #MobileWeb #LocalBusiness",
  },
  {
    id: "28",
    name: "Be the hero of your homepage (Hero Season — July)",
    type: "Single image · Seasonal · Tie-in",
    variant: "webslinger",
    topLeftLabel: "HERO SEASON / 028",
    topRightLabel: "JULY '26",
    kicker: "FRIENDLY NEIGHBORHOOD",
    titleLines: [
      { text: "Be the hero" },
      { text: "of your" },
      { text: "homepage.", italic: true },
    ],
    sub: "Hero season hits theatres July 31. Hero season hits your business the second your homepage loads. Make the entrance worth showing up for.",
    tagRow: ["WITH GREAT TRAFFIC", "COMES GREAT CONVERSION"],
    customLayout: "spidey-swing",
    cta: "DM \"HERO\"",
    caption: `Your homepage is the suit. 🕸️

The version of your business that lives on the internet — that's the one most customers meet first. Before they walk in. Before they call. Before they decide if you're the move.

Hero season hits theaters July 31. Yours starts the second someone taps your link in bio.

Three questions to ask your homepage tonight:

1. Does it load in under 2 seconds on a phone?
2. Can someone book / buy / call in one tap?
3. Does it sound like a real person — or a template?

If you got two no's, that's the audit.

Comment 🕸️ and I'll DM you the 1-page version I'm running for July launches.

With great traffic comes great responsibility.`,
    hashtags:
      "#WebDesigner #SmallBusinessOwner #PhillyBusiness #SmallBusinessMarketing #SummerMarketing #BuiltByBrian #FreelanceWebDesigner #HeroBranding #SmallBusinessTips #BrandStory",
  },
  {
    id: "29",
    name: "Swoop in — Eagles preseason hype",
    type: "Single image · Local · Eagles · Seasonal",
    variant: "swoop",
    topLeftLabel: "PRESEASON / 029",
    topRightLabel: "GO BIRDS",
    kicker: "TRAINING CAMP STARTS",
    titleLines: [
      { text: "Make your" },
      { text: "homepage" },
      { text: "fly.", italic: true },
    ],
    sub: "Swoop doesn't half-show up. Neither should your site. Built sharp, hosted fast, ready before the home opener.",
    tagRow: ["FLY · EAGLES · FLY", "SHIP BEFORE WEEK ONE"],
    customLayout: "swoop-flex",
    cta: "DM \"WEEK ONE\"",
    caption: `Swoop doesn't half-show-up. 🦅

He's at training camp with the same energy he had at the parade. Every practice. Every preseason. Every soggy Tuesday.

You know what doesn't have that energy?

Your homepage at 6 PM on a Sunday when someone Googles you for the first time.

The site is the warm-up. The site is the pregame. The site is the version of your business that's working while you're at the bar watching the game.

Three slots open between now and the home opener. I can have you live before Week One — full custom, mobile-first, the kind of build that hits like a kickoff.

Drop a 🦅 in the comments for the preseason audit, or DM "WEEK ONE" if you're ready to roll out.

Always go birds. Always show up.`,
    hashtags:
      "#FlyEaglesFly #GoBirds #PhiladelphiaEagles #PhillyBusiness #PhillySmallBusiness #BirdGang #WebDesignerPhiladelphia #BuiltByBrian #PhillyEntrepreneur #ShopLocal #PhillySmallBiz",
  },
  {
    id: "30",
    name: "Ring the bell — Phanatic summer",
    type: "Single image · Local · Phillies · Seasonal",
    variant: "phanatic",
    topLeftLabel: "DOG DAYS / 030",
    topRightLabel: "RING THE BELL",
    kicker: "SUMMER · '26",
    titleLines: [
      { text: "Ring your own" },
      { text: "bell this" },
      { text: "summer.", italic: true },
    ],
    sub: "The Phanatic doesn't wait for the eighth inning to bring the noise. Your homepage shouldn't either — every scroll should hit like a home run swing.",
    tagRow: ["RED · OCTOBER", "STILL · ROLLING"],
    customLayout: "phanatic-hype",
    cta: "DM \"PHANATIC\"",
    caption: `The Phanatic isn't waiting for the 8th inning. 🔔

First pitch — bringing it.
3-1 loss in a Tuesday day game — bringing it.
Random Wednesday in July when nobody's watching — still bringing it.

That's the standard. Show up bright. Show up loud. Show up whether the room is full or it's just you and the security guard.

Your homepage should be on the same energy. The customer Googling you on a Tuesday afternoon deserves the same hit as the one walking past your shop on Saturday night.

If yours feels more "rain delay" than "Bryce in October" — comment 🔔 and I'll send you the 1-page summer audit I'm running for July launches.

Two slots left. We can have you live before the All-Star Break.

Atta babe.`,
    hashtags:
      "#Phillies #PhilliePhanatic #RingTheBell #RedOctober #PhillyBusiness #PhillySmallBusiness #SouthJerseyBusiness #SummerMarketing #WebDesignerPhiladelphia #BuiltByBrian #GoPhils",
  },
  {
    id: "31",
    name: "Before / After — Mama's Trattoria (proof)",
    type: "Carousel · 4 slides · Proof · Case Study",
    variant: "ocean",
    topLeftLabel: "BEFORE / AFTER / 031",
    topRightLabel: "01 / 04",
    kicker: "REAL CLIENT · REAL NUMBERS",
    titleLines: [
      { text: "Before." },
      { text: "After.", italic: true },
    ],
    sub: "10-year-old WordPress theme. 6-second load. Buried menu. Six weeks later — new site, 1.4s load, reservations live in the header.",
    numList: [
      { n: "↓", text: "Load time: 6.1s → 1.4s" },
      { n: "↑", text: "Mobile conversions: +217%" },
      { n: "✓", text: "Online reservations now 41% of weekly bookings" },
      { n: "★", text: "Owner can edit the menu without calling anyone" },
    ],
    cta: "See more",
    ctaArrow: true,
    caption: `Real client. Real numbers. 📈

Mama's Trattoria — 12 years in business, 10-year-old WordPress theme, 6-second mobile load, menu buried 3 clicks deep.

Six weeks later 👇

→ Load time: 6.1s → 1.4s
→ Mobile conversions: +217%
→ Online reservations: now 41% of weekly bookings
→ Owner can update the menu herself, in 30 seconds, from her phone

Same restaurant. Same food. Same vibe. New website doing the heavy lifting.

If your site is the bottleneck — let's talk. Free 30-min teardown. DM "AUDIT" or tap the link in bio.`,
    hashtags:
      "#PhillyRestaurants #RestaurantMarketing #BeforeAndAfter #WebDesigner #SmallBusinessOwner #PhillyFood #FoodieOfPhilly #BuiltByBrian #CaseStudy #PhillyBusiness",
  },
  {
    id: "32",
    name: "If your site can survive a Tuesday — it can survive a Saturday",
    type: "Single image · Hot Take",
    variant: "citrus",
    topLeftLabel: "HOT TAKE / 032",
    topRightLabel: "SAVE THIS",
    kicker: "REAL TALK",
    titleLines: [
      { text: "If it can't" },
      { text: "survive a" },
      { text: "Tuesday —", italic: true },
    ],
    sub: "It won't survive a Saturday. Most small-business sites quietly leak revenue every weekday afternoon. Then Saturday hits and the bleeding goes loud.",
    tagRow: ["CHECK ON A WEEKDAY", "FIX BEFORE THE WEEKEND"],
    customLayout: "calendar-tile",
    cta: "@builtbybwhirl",
    caption: `Open your own site. On your phone. On 4G. At 2 PM on a Tuesday.

Time it. Be honest about what you see.

If it stutters, if the menu PDF takes 5 seconds to render, if the reservation link is buried 3 taps deep —

That's the version your customers are getting all week.

Then Saturday night hits and you wonder why the dining room's half full.

The fix isn't a redesign. It's caring whether the front door works.

Tap the bio if you want a free 5-minute audit before the next weekend.`,
    hashtags:
      "#WebDesignTips #SmallBusinessOwner #PhillyBusiness #RestaurantMarketing #MobileWeb #WebDesigner #BuiltByBrian #SmallBusinessTips #SiteSpeed",
  },
  {
    id: "33",
    name: "Pick your starter — Pokemon edition",
    type: "Single image · Engagement · Nostalgia",
    variant: "starter",
    topLeftLabel: "TURN 28 / 033",
    topRightLabel: "WHO'S YOURS?",
    kicker: "1996 → 2026",
    titleLines: [
      { text: "Pick your" },
      { text: "starter", italic: true },
      { text: "(again)." },
    ],
    sub: "Twenty-eight years and the question still hits. Three starters, three energies — and only one of them is built for the year you're actually in.",
    tagRow: ["GRASS · STARTER", "FIRE · PRO", "WATER · CUSTOM"],
    customLayout: "starter-trio",
    cta: "Comment yours",
    caption: `1996. You picked one.

Bulbasaur, Charmander, or Squirtle — and you defended that pick on the bus all the way home from school.

Twenty-eight years later, same question. Different stakes.

Your business is picking a starter right now too. Which one's yours?

🌱 Bulbasaur — the Starter ($750)
Reliable. Grows steady. You don't need flash, you need a solid 5-page foundation that just works. Mobile-first, your contact form actually sends, you own the code forever.

🔥 Charmander — the Pro ($1,200)
You're ready to scale. Up to 10 pages, custom design system, CMS so you can edit copy yourself at 11 PM without calling me. This is the build that turns scrollers into bookings.

💧 Squirtle — the Custom ($3,000+)
Defensive. Deep. Built for the long fight. E-commerce, custom integrations, scaling for traffic spikes. For businesses that need range — and the years to prove it.

Comment your starter pick (1996 AND 2026) and I'll DM you the breakdown for which tier actually fits where you are right now.

(There are no wrong answers. Except Pikachu. Pikachu wasn't a starter. Stop trying to make Pikachu happen.)`,
    hashtags:
      "#Pokemon #PickYourStarter #SmallBusinessOwner #PhillyBusiness #WebDesigner #FreelanceLife #90sKids #BuiltByBrian #SmallBusinessMarketing #NostalgiaMarketing #BulbasaurCharmanderSquirtle #PhillyEntrepreneur",
  },
  {
    id: "34",
    name: "About The Designer — receipts & rankings",
    type: "Single image · Founder · Throwback",
    variant: "studio",
    topLeftLabel: "ABOUT / 034",
    topRightLabel: "EST '96",
    kicker: "MEET YOUR DEVELOPER",
    titleLines: [
      { text: "About the" },
      { text: "designer", italic: true },
      { text: "." },
    ],
    sub: "The throwback you didn't ask for. The receipts you might need.",
    customLayout: "about-designer",
    cta: "Work with me",
    ctaArrow: true,
    caption: `Started young. The CRT, the towers of CD-ROMs, mom standing behind me on a disposable camera.

Twenty-something years later — same energy, better hardware, real receipts:

OFFICIAL
→ BS, Management Information Systems
→ MBA, finishing Spring '27

UNOFFICIAL (the real proof)
→ iOS > Android
→ Spotify > Apple Music
→ Nintendo > Xbox > PlayStation (fight me)
→ Instagram > every other social
→ First phone: an LG Kajeet (IYKYK)

Now I hand-build custom websites for restaurants, studios, shops, and service businesses across Philly + South Jersey. Same focus the kid in the photo had — just billable now.

If your website needs that "I've been on a keyboard since before flip phones" energy — let's build.

DM me, link in bio, or comment your unpopular tech ranking below 👇`,
    hashtags:
      "#FounderStory #ThrowbackThursday #WebDesigner #FreelanceLife #90sKids #PhillyBusiness #PhillyEntrepreneur #SmallBusinessOwner #BuiltByBrian #WebDesignerPhiladelphia #SouthJerseyBusiness #FreelanceWebDesigner",
  },
];
