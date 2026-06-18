const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, TabStopType,
  TabStopPosition, PageBreak,
} = require('docx');

const FONT = 'Calibri';
const ACCENT = '8A6630';
const RULE = 'D5C9B5';

const heading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({ heading: level, children: [new TextRun({ text, font: FONT })] });

const para = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: Array.isArray(text)
      ? text.map(t => typeof t === 'string' ? new TextRun({ text: t, font: FONT, size: 22 }) : t)
      : [new TextRun({ text, font: FONT, size: 22, ...(opts.runOpts || {}) })],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  });

const numbered = (text) =>
  new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  });

const blank = (size = 100) =>
  new Paragraph({ spacing: { after: size }, children: [new TextRun('')] });

const divider = () =>
  new Paragraph({
    spacing: { before: 80, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 1 } },
    children: [new TextRun('')],
  });

const sectionTitle = (text) =>
  new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: ACCENT, characterSpacing: 30 })],
  });

const subTitle = (text) =>
  new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT, size: 22, bold: true })],
  });

const pageItem = (label, body) => [
  new Paragraph({
    spacing: { before: 140, after: 40 },
    children: [new TextRun({ text: label, font: FONT, size: 22, bold: true })],
  }),
  para(body),
];

const childrenWithoutLast = (arr) => arr;

// Build the document
const children = [];

// HEADER / TITLE BLOCK
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'ILLUMINATE BEAUTY BAR', font: FONT, size: 36, bold: true, color: ACCENT, characterSpacing: 60 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [new TextRun({ text: 'Website Build Proposal', font: FONT, size: 28, italics: true, color: '555555' })],
  }),
);

// Prepared for / by block as a simple table
const infoCell = (label, value) =>
  new TableCell({
    width: { size: 3120, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    children: [
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: label, font: FONT, size: 16, bold: true, color: ACCENT, characterSpacing: 40 })],
      }),
      new Paragraph({ children: [new TextRun({ text: value, font: FONT, size: 22 })] }),
    ],
  });

children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [new TableRow({
      children: [
        infoCell('PREPARED FOR', 'Kelli, Illuminate Beauty Bar'),
        infoCell('PREPARED BY', 'Brian Whirlow, BuiltbyBrian'),
        infoCell('DATE', '__________________'),
      ],
    })],
  }),
  blank(200),
);

// OPENING LETTER
children.push(
  para('Hey Kelli,'),
  blank(60),
  para(
    'Putting this together based on everything you shared. Your branding is already ' +
    'dialed. The “create some magic” voice is alive, the studio aesthetic is on ' +
    'point, and your pricing puts you firmly in the modern luxe tier you’re going for.'
  ),
  para(
    'This is about giving the brand you’ve already built a place to live on ' +
    'its own domain, with a dedicated home for bridal and a site you can update ' +
    'yourself any time something changes.'
  ),
  divider(),
);

// HIGHLIGHTS
children.push(
  sectionTitle('HIGHLIGHTS'),
  numbered(
    'A dedicated bridal page with your story, editorial gallery, and a custom ' +
    'inquiry form that lands straight in your inbox.'
  ),
  numbered(
    'Free consultation featured front and center as a primary CTA.'
  ),
  numbered(
    'Your own custom domain (illuminatebeautybar.com or similar) so the address ' +
    'bar reflects your brand.'
  ),
  numbered(
    'Self edit access so you can update photos, hours, service info, and copy ' +
    'whenever you want. I handle the structural and design side of things.'
  ),
  divider(),
);

// WHAT I'LL BUILD
children.push(
  sectionTitle('WHAT I’LL BUILD'),
  para(
    'A 6 page custom website on Wix Studio, fully branded in nude, tan, light pink, ' +
    'gold, and white with star and stardust accents woven throughout. Modern Luxe, ' +
    'header to footer. Connected to your own custom domain so customers see your ' +
    'brand in the URL.'
  ),
  ...pageItem('PAGE 1, HOME',
    'Hero with your logo, “create some magic” treatment, and a sticky ' +
    '“Book Now” button that follows the viewer down the page. Gallery ' +
    'preview, services overview, and a clear lead in to bridal.'
  ),
  ...pageItem('PAGE 2, SERVICES',
    'Your full menu cleaned up and reorganized. Instead of 50+ entries, 4 confident ' +
    'tiers: COLOR, CUT, EXTENSIONS, MAKEUP, with starting prices and “what’s ' +
    'included” descriptions. Booking button on every section.'
  ),
  ...pageItem('PAGE 3, BRIDAL (the centerpiece)',
    'Dedicated page for the side of the business you’re growing into. Editorial ' +
    'photo layout, your bridal story, what working with you looks like from first ' +
    'contact through wedding day, and a custom inquiry form built directly on the ' +
    'site (not a Google link) that emails you the moment a bride hits submit. ' +
    'Wedding date, party size, location, vision board prompts.'
  ),
  ...pageItem('PAGE 4, GALLERY',
    'Magazine style layout for your work. Loads fast on mobile, which is where most ' +
    'of your IG traffic comes from. Editorial spacing, gold accent rules, hover ' +
    'states that feel intentional. Not a generic Wix grid.'
  ),
  ...pageItem('PAGE 5, ABOUT KELLI',
    'The page you don’t have today and bridal clients especially need. Your ' +
    'story, your why, your photo. Room to grow as your brand grows.'
  ),
  ...pageItem('PAGE 6, CONTACT',
    'Form, studio info, booking button, and your free consultation CTA front and ' +
    'center where it should be.'
  ),
  divider(),
);

// INCLUDED, NO UPCHARGE
children.push(
  sectionTitle('INCLUDED, NO UPCHARGE'),
  bullet('Custom bridal inquiry form (sends to your email instantly)'),
  bullet('Local SEO setup. Haddon Township, Camden County, South Jersey wedding and hair search terms baked in'),
  bullet('Mobile native design tested at every screen size'),
  bullet('Sticky “Book Now” button on every page'),
  bullet('Free consultation elevated as a second CTA'),
  bullet('Star and stardust visual accents (handled, not afterthought)'),
  bullet('Custom domain setup (illuminatebeautybar.com or similar)'),
  bullet('Self edit access so you can update photos, hours, service info, and copy yourself any time'),
  bullet('Two rounds of revisions before launch'),
  bullet('30 minute training call after launch so you’re fully comfortable running your own updates'),
  divider(),
);

// INVESTMENT
children.push(
  sectionTitle('INVESTMENT'),
  new Paragraph({
    spacing: { after: 120 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: 'Complete Build and Launch', font: FONT, size: 24, bold: true }),
      new TextRun({ text: '\t$1,400', font: FONT, size: 24, bold: true, color: ACCENT }),
    ],
  }),
  blank(80),
  subTitle('PAYMENT'),
  para([
    new TextRun({ text: '$700 deposit ', font: FONT, size: 22, bold: true }),
    new TextRun({ text: 'to start', font: FONT, size: 22 }),
  ]),
  para([
    new TextRun({ text: '$700 ', font: FONT, size: 22, bold: true }),
    new TextRun({ text: 'on launch day', font: FONT, size: 22 }),
  ]),
  para('Venmo, Zelle, or card. Whichever’s easiest for you.'),
  divider(),
);

// TIMELINE
children.push(sectionTitle('TIMELINE'));

const tlRow = (label, body) => new TableRow({
  children: [
    new TableCell({
      width: { size: 1500, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: 'EEE4D2' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      children: [new Paragraph({ children: [new TextRun({ text: label, font: FONT, size: 22, bold: true, color: ACCENT })] })],
    }),
    new TableCell({
      width: { size: 7860, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: 'EEE4D2' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      },
      children: [new Paragraph({ children: [new TextRun({ text: body, font: FONT, size: 22 })] })],
    }),
  ],
});

children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1500, 7860],
    rows: [
      tlRow('DAY 1', 'Kickoff call. We lock the vision, colors, and content'),
      tlRow('DAY 5', 'First draft live in your inbox'),
      tlRow('WEEK 2', 'Round 1 revisions, then polish'),
      tlRow('WEEK 3', 'Round 2 revisions, then launch prep'),
      tlRow('WEEK 3, 4', 'Launch'),
    ],
  }),
  blank(160),
  para('Most clients are live in 2 to 4 weeks. Pace depends on how quickly we trade feedback. You move fast, we move fast.'),
  divider(),
);

// AFTER LAUNCH
children.push(
  sectionTitle('AFTER LAUNCH, YOUR OPTIONS'),
  para(
    'Once we launch, you pick how the site is run going forward. Most clients in ' +
    'your spot pick Path A because it keeps everything off your plate except the ' +
    'fun part (adding new work). Path C is the long term growth path if you ever ' +
    'want to move off platforms entirely.'
  ),
  blank(120),
);

// PATH A
children.push(
  new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [
      new TextRun({ text: 'PATH A, FULL CARE ', font: FONT, size: 26, bold: true }),
      new TextRun({ text: '(recommended)', font: FONT, size: 22, italics: true, color: ACCENT }),
    ],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: '$85 a month. ', font: FONT, size: 26, bold: true, color: ACCENT }),
      new TextRun({ text: 'Cancel anytime, no contract.', font: FONT, size: 22 }),
    ],
  }),
  para(
    'Here’s how that breaks down. You’re already paying Wix around $36 a ' +
    'month right now to keep your platform running. Path A keeps that $36 (Wix ' +
    'doesn’t get cheaper), and adds $49 for me to run everything for you. So ' +
    'you’re really only adding $49 a month on top of what you’re already ' +
    'paying today.'
  ),
  para(
    'I host the site on my Wix Studio account, so all the billing comes through me ' +
    'in one clean charge. You can cancel your current Wix subscription and stop ' +
    'juggling two bills.'
  ),
  subTitle('What you get to do (in your own content portal):'),
  bullet('Upload new gallery photos (drag and drop)'),
  bullet('Update your hours'),
  bullet('Change service prices or add seasonal specials'),
  bullet('Edit copy on existing pages'),
  bullet('Add or swap out portfolio entries'),
  subTitle('What I handle:'),
  bullet('Page layout changes'),
  bullet('New sections or pages'),
  bullet('Brand or design updates'),
  bullet('Anything technical, anything broken, anything new'),
  blank(80),
  para('Includes monthly check ins and priority response when you need something fast.'),
);

// PATH B
children.push(
  new Paragraph({
    spacing: { before: 280, after: 80 },
    children: [new TextRun({ text: 'PATH B, ON YOUR OWN', font: FONT, size: 26, bold: true })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: '$0 ', font: FONT, size: 26, bold: true, color: ACCENT }),
      new TextRun({ text: 'to me after launch.', font: FONT, size: 22 }),
    ],
  }),
  para(
    'I hand over the keys, walk you through the Wix editor on our 30 minute ' +
    'training call, and you run everything yourself on your own Wix account (the ' +
    'one you already pay for). Easy to manage. If you ever need help later, my ' +
    'hourly rate is $75 an hour, or you can flip onto Path A any time.'
  ),
);

// PATH C
children.push(
  new Paragraph({
    spacing: { before: 280, after: 80 },
    children: [
      new TextRun({ text: 'PATH C, PRO PLAN ', font: FONT, size: 26, bold: true }),
      new TextRun({ text: '(down the road)', font: FONT, size: 22, italics: true, color: ACCENT }),
    ],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: '$99 a month, ', font: FONT, size: 26, bold: true, color: ACCENT }),
      new TextRun({ text: 'when you’re ready.', font: FONT, size: 22 }),
    ],
  }),
  para(
    'If at some point you want to move off Wix and GlossGenius entirely, I can ' +
    'migrate you to a fully custom site with booking built directly into the ' +
    'website. No Wix subscription, no GlossGenius fee, no third party apps. ' +
    'Just your site, your booking, your data.'
  ),
  subTitle('What’s included on the Pro Plan:'),
  bullet('Fully custom site I host myself (no Wix)'),
  bullet('Booking system built directly into the site (no GlossGenius)'),
  bullet('Priority support'),
  bullet('No third party platforms or app dependencies'),
  bullet('All updates, structural changes, and ongoing care'),
  blank(80),
  para(
    'The migration build itself is a separate scope we’d quote when you’re ' +
    'ready to make the move. Once it’s live, the $99 a month covers everything.'
  ),
  divider(),
);

// WHY WIX STUDIO
children.push(
  sectionTitle('WHY WIX STUDIO FOR YOU'),
  para(
    'Quick note in case you’ve seen my portfolio and wondered why I’m ' +
    'recommending Wix Studio instead of a fully custom Next.js build.'
  ),
  numbered('You’ll want to update content yourself. New gallery photos, seasonal promos, new services. Wix is built exactly for that.'),
  numbered('Booking lives on GlossGenius already, so the site doesn’t need a heavy custom backend right now. Wix handles everything else cleanly.'),
  numbered('We launch faster, you save money, and the design quality on Wix Studio is right where modern luxe lives.'),
  para(
    'Wix is the right call for today. When you’re ready to go fully custom and ' +
    'cut platforms loose, that’s Path C above.'
  ),
  divider(),
);

// WHAT I NEED FROM YOU
children.push(
  sectionTitle('WHAT I NEED FROM YOU TO START'),
  bullet('Logo files, both versions you mentioned (transparent and white)'),
  bullet('8 to 12 favorite photos for the gallery. More is fine, more is better'),
  bullet('Rough draft of your bio for the About page'),
  divider(),
);

// CLOSING
children.push(
  sectionTitle('DOES THIS SOUND OKAY?'),
  para(
    'Take a look and let me know if anything lands different than what you had in ' +
    'mind. Happy to adjust scope, tweak the After Launch options, or anything else.'
  ),
  para(
    'We can go through all of it on a call, or set up a quick Zoom if that’s ' +
    'easier. Whatever works for you.'
  ),
  para(
    'Whenever you’re ready, I’ll send the deposit invoice and a Calendly ' +
    'link so we can lock in the kickoff. Aiming to have you live before bridal ' +
    'season kicks back up so the site is already pulling for you the day ' +
    'inquiries start landing.'
  ),
  para('Excited about this one, Kelli. Going to be a beautiful build.'),
  blank(120),
  para([
    new TextRun({ text: 'Brian', font: FONT, size: 26, italics: true }),
  ]),
  divider(),
);

// SIGNATURE BLOCK
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'Brian Whirlow', font: FONT, size: 26, bold: true, color: ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: 'Web Designer and Developer  •  BuiltbyBrian', font: FONT, size: 20, italics: true, color: '555555' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: 'brianwhirlowbusiness@gmail.com   •   (856) 625-3533', font: FONT, size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: 'builtbybwhirl.com', font: FONT, size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: 'Philadelphia & South Jersey', font: FONT, size: 22, italics: true, color: '555555' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 0 },
    children: [new TextRun({ text: 'This proposal is valid for 14 days from the date above.', font: FONT, size: 18, italics: true, color: '888888' })],
  }),
);

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: ACCENT },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '❖', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { color: ACCENT } } }] },
      { reference: 'numbers',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { color: ACCENT, bold: true } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

const outPath = path.join(__dirname, '..', 'Illuminate-Beauty-Bar-Proposal.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('Wrote', outPath, '(', buf.length, 'bytes )');
});
