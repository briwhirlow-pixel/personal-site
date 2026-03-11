# personal-site

Personal portfolio and business site for Brian Whirlow — freelance web design & development.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Resend (transactional email)
- react-hook-form + zod (form validation)

## Structure
- `src/app/` — App Router pages and API routes
- `src/components/` — UI components (Navbar, Hero, Services, Portfolio, Contact, Footer)
- `src/lib/data.ts` — Site content data (services, portfolio projects)

## Environment Variables
See `.env.example`. Required vars:
- `RESEND_API_KEY` — get a free key at resend.com
- `CONTACT_TO_EMAIL` — the inbox that receives contact form submissions

## Dev
```bash
npm run dev    # start dev server at localhost:3000
npm run build  # production build
npm start      # run production build
```

## Before Launch Checklist
- [ ] Replace placeholder prices in `src/lib/data.ts`
- [ ] Add real portfolio project screenshots to `public/images/`
- [ ] Update portfolio project data in `src/lib/data.ts`
- [ ] Add your real email in `.env` (`CONTACT_TO_EMAIL`)
- [ ] Set up Resend account and add real API key
- [ ] Add Calendly link in `src/components/Contact.tsx`
- [ ] Add LinkedIn / GitHub links in `src/components/Footer.tsx`
- [ ] Set `metadataBase` URL in `src/app/layout.tsx`
