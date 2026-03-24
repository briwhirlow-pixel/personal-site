import { readFileSync, writeFileSync } from 'fs';
const file = './src/app/gym/page.tsx';
let c = readFileSync(file, 'utf8');

// Background colors - move from pure black to deep navy
c = c.replaceAll('min-h-screen bg-black', 'min-h-screen bg-[#080C14]');
c = c.replaceAll('"min-h-screen bg-black', '"min-h-screen bg-[#080C14]');
c = c.replaceAll('bg-black/80', 'bg-[#080C14]/80');
c = c.replaceAll('bg-black/20', 'bg-[#080C14]/20');

// Card surfaces - deep navy cards
c = c.replaceAll('bg-[#1C1C1E]', 'bg-[#0F1628]');
c = c.replaceAll('bg-[#2C2C2E]', 'bg-[#162038]');

// Primary accent: green CTAs → electric indigo
c = c.replaceAll('bg-[#30D158] active:bg-[#28BD4E]', 'bg-[#6366F1] active:bg-[#4F46E5]');
c = c.replaceAll('bg-[#30D158] active:bg-[#25A244]', 'bg-[#6366F1] active:bg-[#4F46E5]');
c = c.replaceAll('active:bg-[#28BD4E]', 'active:bg-[#4F46E5]');
c = c.replaceAll('active:bg-[#25A244]', 'active:bg-[#4F46E5]');

// Focus ring
c = c.replaceAll('focus:ring-[#30D158]', 'focus:ring-[#6366F1]');

// CTA button shadows
c = c.replaceAll('shadow-[#30D158]/20', 'shadow-[#6366F1]/20');

// Selected/active borders (not the completion ones, those use #30D158 intentionally)
c = c.replaceAll('border-[#30D158]/50', 'border-[#6366F1]/50');

// Builder step progress dots (the h-1.5 w-8 dots)
c = c.replaceAll("step <= builderStep ? 'bg-[#30D158]'", "step <= builderStep ? 'bg-[#6366F1]'");

// Builder day type selection highlighted state
c = c.replaceAll("'bg-[#30D158]/20 border-[#30D158]'", "'bg-[#6366F1]/20 border-[#6366F1]'");
c = c.replaceAll('w-6 h-6 bg-[#30D158] rounded-full', 'w-6 h-6 bg-[#6366F1] rounded-full');

// Activity ring colors for workout rings (NOT the completion checkmarks)
// Cycle card ring
c = c.replaceAll("cycle.status === 'active' ? '#30D158' : '#8E8E93'", "cycle.status === 'active' ? '#6366F1' : '#8E8E93'");
// Exercise list rings (the `color="#30D158"` in ActivityRing for exercise cards)
// History rings
c = c.replaceAll('size={44} color="#30D158"', 'size={44} color="#6366F1"');

// The isSaving spinner color
c = c.replaceAll('text-[#30D158] text-xs flex items-center gap-1', 'text-[#6366F1] text-xs flex items-center gap-1');
c = c.replaceAll('border border-[#30D158] border-t-transparent', 'border border-[#6366F1] border-t-transparent');

// Login loading spinner
c = c.replaceAll('border-t-[#30D158] rounded-full animate-spin', 'border-t-[#6366F1] rounded-full animate-spin');

// The CTA bg where it's just standalone bg-[#30D158] on a button element
// (This catches the remaining button backgrounds for Start Workout, Start New Cycle, Sign In, Continue)
c = c.replaceAll('"w-full bg-[#30D158]', '"w-full bg-[#6366F1]');

// Training max save button (the small circle save button)
c = c.replaceAll('className="w-11 h-11 bg-[#30D158] rounded-full', 'className="w-11 h-11 bg-[#6366F1] rounded-full');

// The TM input focus ring
c = c.replaceAll('focus:ring-2 focus:ring-[#30D158]', 'focus:ring-2 focus:ring-[#6366F1]');

writeFileSync(file, c);
console.log('Done. Lines:', c.split('\n').length);
