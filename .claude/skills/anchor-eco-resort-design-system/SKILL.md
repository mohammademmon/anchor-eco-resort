---
name: anchor-eco-resort-design-system
description: >
  The single source of truth for the Anchor Eco Resort & Spa website look & feel — an
  "eco-luxe / natural calm" premium design system. Use this skill whenever building or
  styling ANY part of this project: pages, sections, components (buttons, cards, nav,
  forms, sticky CTA), choosing colors, typography, spacing, radius, shadows, motion, or
  imagery treatment, and when reviewing a section's frontend quality. Its job is to make
  every part of the site read as one consistent, high-end system worth its price. Trigger
  on: build a page/section, style a component, pick colors/fonts/spacing, add an animation,
  set up Tailwind/globals.css/fonts, or "make this look premium/consistent".
---

# Anchor Eco Resort & Spa — Design System (Eco-Luxe / Natural Calm)

> Read this before writing a single line of UI. The one rule that separates a $50k site
> from a $5k site is **consistency** — every section must look designed by the same hand.
> Use ONLY the tokens below. Never invent one-off colors, font sizes, or spacings.

## 1. Design principles

1. **Calm, not loud.** Warm, natural, unhurried. The photography (beach, pool, thatch,
   greenery) is the star; the UI frames it and gets out of the way.
2. **Generous whitespace.** Space is the #1 signal of premium. When unsure, add more.
3. **Restraint.** Small radius, soft shadows, one accent used sparingly. Luxury whispers.
4. **One hand.** Same spacing scale, same type ramp, same motion everywhere. No drift.
5. **Mobile-first.** This site is opened from a WhatsApp link on a phone. The phone view
   is the primary design; desktop is the enhancement.

## 2. Color system

Warm, earthy, sea-touched. Forest green is the brand/action color; teal is the sea accent;
antique gold is a *rare* premium touch (thin rules, eyebrows, active ticks — never large fills).

Put these in `globals.css`:

```css
:root {
  /* Neutrals — warm paper & sand */
  --paper:        #F5F0E6; /* page background */
  --paper-raised: #FCF9F2; /* cards, raised surfaces */
  --sand:         #E9DFC9; /* soft fills, dividers bg */
  --line:         #E5DCCA; /* borders */
  --ink:          #232821; /* primary text (warm charcoal-green) */
  --ink-soft:     #6B6659; /* secondary text */

  /* Brand */
  --forest:       #2F3D2E; /* PRIMARY: buttons, key actions */
  --forest-600:   #263422; /* hover/pressed */
  --moss:         #5A6E4F; /* icons, subtle green accents */
  --teal:         #4F7E75; /* sea accent, secondary interactive */
  --gold:         #B48A50; /* premium touch — small/decorative ONLY */

  /* Dark "forest night" band (immersive sections, footer, hero scrim) */
  --night:        #1A211A;
  --night-raised: #232B22;
  --on-night:     #EFE9DC;
  --on-night-soft:#B9B3A2;

  /* Utility */
  --focus:        #4F7E75; /* focus ring = teal */
  --radius: 12px;
}
```

Tailwind (`tailwind.config.ts` → theme.extend.colors) mirrors these as semantic names:
`paper, paperRaised, sand, line, ink, inkSoft, forest, forest600, moss, teal, gold, night,
nightRaised, onNight, onNightSoft`. Reference tokens by name — never raw hex in components.

**Contrast rules:** body text is always `ink` on `paper`/`paperRaised` (passes AA). On dark
bands use `onNight`. `gold` is decorative or large-only (it does not pass AA as small body
text) — links and body use `forest`/`teal`.

## 3. Typography

Two Latin families + a matched Bangla pair (bilingual EN/BN). All from Google Fonts, loaded
with `next/font` and exposed as CSS variables.

- **Display / headings (EN):** `Fraunces` (variable, use optical sizing) — warm modern serif.
- **Body / UI (EN):** `Inter`.
- **Display / headings (BN):** `Noto Serif Bengali`.
- **Body / UI (BN):** `Hind Siliguri`.

```ts
// app/fonts.ts
import { Fraunces, Inter, Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
export const display   = Fraunces({ subsets:["latin"], variable:"--font-display", display:"swap" });
export const body      = Inter({ subsets:["latin"], variable:"--font-body", display:"swap" });
export const bnDisplay = Noto_Serif_Bengali({ subsets:["bengali"], variable:"--font-bn-display", display:"swap" });
export const bnBody    = Hind_Siliguri({ subsets:["bengali"], weight:["300","400","500","600"], variable:"--font-bn-body", display:"swap" });
```

When `locale === "bn"`, set `--font-display: var(--font-bn-display)` and
`--font-body: var(--font-bn-body)` on `<html>` (a `data-lang="bn"` class swap). Bangla needs
slightly looser line-height (add ~0.1).

**Type scale** (fluid; base 16px):

| Token     | Size                              | Family  | Weight | Leading | Tracking |
|-----------|-----------------------------------|---------|--------|---------|----------|
| display   | clamp(2.75rem, 6vw, 5rem)         | display | 400–500| 1.05    | -0.02em  |
| h1        | clamp(2.25rem, 4vw, 3.25rem)      | display | 400–500| 1.1     | -0.015em |
| h2        | clamp(1.75rem, 3vw, 2.5rem)       | display | 500    | 1.15    | -0.01em  |
| h3        | 1.5rem                            | display | 500    | 1.2     | normal   |
| body-lg   | 1.125rem                          | body    | 400    | 1.7     | normal   |
| body      | 1rem                              | body    | 400    | 1.7     | normal   |
| small     | 0.875rem                          | body    | 400    | 1.6     | normal   |
| eyebrow   | 0.8125rem UPPERCASE               | body    | 500    | 1       | 0.18em   |

Eyebrow/overline (small uppercase label above a heading) is colored `teal` or `gold` and is a
signature of the system — use it to open most sections. Body copy max width `65ch`.

## 4. Spacing, grid & layout

- **Base unit 4px; work in the 4/8 scale only** (4,8,12,16,24,32,48,64,80,96,128).
- **Section vertical rhythm:** `py-24 md:py-32 lg:py-40`. Premium = roomy.
- **Container:** `max-w-[1280px] mx-auto px-6 md:px-10`.
- **Prose width:** `max-w-[65ch]` for paragraphs.
- **Grid gaps:** cards `gap-6 lg:gap-8`.
Never use arbitrary one-off paddings/margins outside the scale.

## 5. Radius, shadows, borders, texture

- **Radius:** buttons `rounded-full` (elegant pills); cards & images `rounded-2xl`; inputs
  `rounded-lg`. Keep it restrained and consistent.
- **Shadows:** soft, warm-tinted, low opacity — prefer border + subtle shadow over heavy drop
  shadows. Tokens:
  - `shadow-soft`: `0 1px 2px rgba(35,40,33,.04), 0 10px 30px rgba(35,40,33,.06)`
  - `shadow-lift` (hover): `0 12px 40px rgba(35,40,33,.12)`
- **Borders:** `1px solid var(--line)` on light surfaces.
- **Texture (optional, subtle):** a faint paper/linen noise at ~3% opacity on large flat bands
  adds warmth. Never let it compete with photos.

## 6. Motion

Stack: **Lenis** (smooth scroll, lerp ~0.1) + **Framer Motion** (reveals). Slow, soft, purposeful.

- **Duration tokens:** fast 150ms · base 250ms · slow 400ms · reveal 800ms.
- **Signature easing:** `[0.22, 1, 0.36, 1]` (ease-out-expo feel) for reveals.
- **Reveal recipe:** `initial {opacity:0, y:24}` → `whileInView {opacity:1, y:0}`,
  `duration:0.8`, `viewport {once:true, margin:"-80px"}`, stagger children `0.08–0.12`.
- **Parallax:** subtle only — max 8–12% shift. Never dizzying.
- **Hover:** images `scale:1.03` over 300ms; buttons lift 1–2px.
- **Always** honor `prefers-reduced-motion`: drop transforms/parallax, keep gentle opacity.
- Target 60fps — animate `transform`/`opacity` only.

## 7. Component specs

**Primary button** — `bg-forest text-paper rounded-full px-7 py-3.5 font-medium`,
hover `bg-forest600` + 1px lift, `focus-visible` teal ring. 
**Secondary/ghost** — transparent, `border border-line text-ink`, hover `bg-paperRaised`.
**Sticky WhatsApp CTA** — always visible: floating pill bottom-right on mobile, in the header
on desktop. WhatsApp icon + short label ("Book on WhatsApp" / "হোয়াটসঅ্যাপে বুক করুন"). Links to
`https://wa.me/8801897629200`. This is the money button — never let it disappear.
**Navbar** — transparent over the hero (white text), transitions to `bg-paper/90 backdrop-blur`
+ `shadow-soft` + `ink` text once scrolled past ~80px. Logo left; links + language toggle +
WhatsApp CTA right; mobile = slide-in drawer.
**Section header** — eyebrow (teal/gold uppercase) → `h2` (display) → optional `body-lg` intro,
alignment consistent across the site (default left; hero/centerpieces may center).
**Room card** — image `aspect-[4/3] rounded-2xl` with hover zoom; view badge (e.g. "Sea View");
name in `h3` serif; one-line `small` inkSoft; price line `from ৳5,400 / night` (price in
`display`/medium); `View details →` link. Card hover: `shadow-lift`.
**Offer card** — image, badge (e.g. "Winter Special" gold pill), title, short desc, price with
strike-through original if any, CTA.
**Forms** (booking inquiry) — inputs `rounded-lg border-line bg-paperRaised px-4 py-3`, clear
labels, teal focus ring, inline Zod errors in a warm red, generous spacing, a confident primary
submit. Show success + error + loading states — never a dead button.

## 8. Imagery rules

- Heroes are **full-bleed** with a subtle forest-tinted gradient scrim
  (`from-night/60 to-transparent`) so overlaid text stays legible.
- Inline images: consistent `rounded-2xl`, `object-cover`, fixed `aspect-ratio` boxes to
  prevent layout shift.
- Always `next/image`; `priority` on the hero, correct `sizes`; lazy-load the rest.
- Warm treatment — avoid cold blue casts. Real property photos only; no stocky filler.

## 9. Bilingual (EN/BN)

- Swap font families per locale (section 3). Give Bangla ~0.1 extra line-height.
- Bangla strings run longer — buttons/labels must wrap gracefully; test both languages.
- Keep prices in `৳` with Western-Arabic numerals unless the client asks for Bangla numerals.
- Every user-facing string comes from the i18n dictionary — no hardcoded copy in components.

## 10. Accessibility (non-negotiable for a premium build)

- Contrast AA: body = `ink` on `paper`; on dark = `onNight`. `gold` decorative/large only.
- Visible `focus-visible` rings (teal) on every interactive element.
- Touch targets ≥ 44px. Alt text on all meaningful images. Labels on all inputs.
- Respect reduced-motion. Keyboard-navigable nav, drawer, and forms.

## 11. The $50k quality checklist (run before calling any section "done")

- [ ] Uses ONLY design tokens (color/type/space/radius) — zero arbitrary values.
- [ ] Generous whitespace; nothing crowded.
- [ ] Clear hierarchy: eyebrow → heading → body, correct sizes.
- [ ] Photography is full-bleed/warm; images have fixed aspect ratios (no layout shift).
- [ ] Consistent radius + soft shadow language with the rest of the site.
- [ ] Motion is subtle, 60fps, reduced-motion safe.
- [ ] Flawless on a 390px phone first, then scales up.
- [ ] Every interactive el has hover + focus states; forms have loading/success/error.
- [ ] Both EN and BN render cleanly (fonts, wrapping).
- [ ] WhatsApp CTA present and working.

**Anti-patterns (instant "cheap" tells) — avoid:** default un-restyled shadcn grey look;
harsh pure-black text (#000) or pure-white cards; heavy drop shadows; more than 2 Latin type
families; cramped spacing; centered walls of text; generic stock imagery; janky/overlong
animations; inconsistent corner radii; a booking button that isn't obviously the priority.

## 12. How to use this skill during the build

1. At the start of any UI task, load these tokens; set up `globals.css`, Tailwind theme, and
   `next/font` from sections 2–3 first if not already done.
2. Build to the component specs (section 7) and imagery rules (section 8).
3. Before finishing a section, run the checklist (section 11); ideally also run the
   `design:design-critique` skill on it and fix what it flags.
4. If a needed pattern isn't defined here, design it *in the spirit of* these principles and
   add it here so the system stays the single source of truth.
