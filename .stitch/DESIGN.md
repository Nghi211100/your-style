# Design System: Your Style — Luxury Fashion Ecommerce

**Project ID:** 7137131962138425523

## 1. Visual Theme & Atmosphere
An opulent, editorial-grade luxury fashion storefront. The atmosphere evokes a high-end atelier — warm ivory surfaces with champagne gold accents, generous negative space, and photography-forward compositions. The density is deliberately airy (3/10) with confident asymmetric layouts (variance 7/10) and fluid spring-physics motion (6/10). Every pixel whispers exclusivity.

## 2. Color Palette & Roles
- **Warm Ivory** (#FDFBF7) — Primary canvas background, warm paper-like surface
- **Pure Linen** (#FFFFFF) — Card surfaces, elevated containers, product image backgrounds
- **Champagne Gold** (#C4A265) — Single accent color for CTAs, highlights, active states, focus rings. Saturation kept refined, never gaudy
- **Deep Espresso** (#1A1814) — Primary text, navigation, headlines — rich near-black with warm undertone
- **Warm Stone** (#8C7E6A) — Secondary text, descriptions, metadata, muted labels
- **Silk Border** (rgba(196, 162, 101, 0.15)) — Card borders, structural dividers, 1px decorative lines
- **Cashmere Gray** (#F0EDE8) — Subtle section backgrounds, hover states, input backgrounds
- **Onyx Surface** (#1A1814) — Dark mode surfaces, footer background, contrast sections

## 3. Typography Rules
- **Display/Headlines:** Outfit — Track-tight (-0.02em), controlled scale, weight-driven hierarchy (700 for h1, 600 for h2, 500 for h3). Uppercase sparingly for brand elements and category labels only
- **Body:** Outfit — Regular weight (400), relaxed leading (1.6), max 65ch width, Warm Stone color for secondary, Deep Espresso for primary
- **Accent/Labels:** Outfit Light (300) — Generous letter-spacing (0.15em), uppercase, used for price tags, category names, section labels
- **Mono:** JetBrains Mono — For order numbers, SKUs, tracking codes, timestamps
- **Banned:** Inter, system fonts, generic serifs (Times New Roman, Georgia). No serif fonts anywhere in this project

## 4. Component Stylings
* **Buttons:** Flat with no outer glow. Primary: Champagne Gold fill (#C4A265) with Deep Espresso text. Secondary: Ghost outline with 1px Champagne Gold border. Tactile -1px translateY on active. Rounded corners (8px). Hover: subtle brightness shift. No neon, no gradients
* **Cards:** Product cards with generous rounded corners (12px). Pure Linen background. Whisper-soft shadow (0 4px 20px rgba(26,24,20,0.06)). Image container with subtle zoom on hover (scale 1.05, 0.4s ease). Price in accent spaced font
* **Inputs/Forms:** Label above in Warm Stone uppercase (0.1em spacing). Input with Cashmere Gray background, 1px Silk Border. Focus ring in Champagne Gold. No floating labels
* **Navigation:** Minimal sticky header — centered "YOUR STYLE" wordmark in Deep Espresso, Outfit Bold, letter-spaced. Clean horizontal nav links, Champagne Gold underline on hover. Subtle backdrop blur
* **Loaders:** Skeletal shimmer in Cashmere Gray matching exact card dimensions. No circular spinners
* **Empty States:** Composed editorial illustrations with Outfit typography

## 5. Layout Principles
- Grid-first responsive architecture with max-width 1400px containment
- Hero sections: Full-viewport height, asymmetric split layouts (60/40 image-to-content)
- Product grids: 4-column on desktop, 2-column on tablet, single column on mobile
- Generous internal padding (clamp(1.5rem, 4vw, 3rem))
- Section gaps: clamp(4rem, 10vw, 8rem)
- No overlapping elements — every element in its own clean spatial zone
- CSS Grid over Flexbox — no calc() hacks

## 6. Design System Notes for Stitch Generation

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Palette: Warm Ivory (#FDFBF7) background, Deep Espresso (#1A1814) text, Champagne Gold (#C4A265) accent, Warm Stone (#8C7E6A) secondary text, Cashmere Gray (#F0EDE8) subtle backgrounds
- Font: Outfit — track-tight headlines (700 weight), relaxed body (400 weight), light uppercase for labels (300 weight, 0.15em spacing)
- Styles: Rounded corners (8px buttons, 12px cards), whisper-soft shadows, no neon/glow effects
- Atmosphere: Luxury fashion atelier — editorial, photography-forward, generous whitespace, warm neutral tones with singular gold accent
- Navigation: Centered brand wordmark "YOUR STYLE", minimal horizontal links
- Interactions: Subtle hover zoom on product images (1.05 scale), tactile button press (-1px), spring-physics transitions

## 7. Motion & Interaction
- Spring physics default: stiffness 100, damping 20 — premium weighty feel
- Staggered cascade reveals for product grids (50ms delay between items)
- Subtle parallax on hero imagery
- Image hover zoom: scale(1.05) with 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- Hardware-accelerated transforms only (transform, opacity)

## 8. Anti-Patterns (Banned)
- No Inter font
- No pure black (#000000) — use Deep Espresso (#1A1814)
- No neon/outer glow shadows
- No oversaturated accents
- No 3-column equal card layouts
- No generic serif fonts
- No "Scroll to explore", scroll arrows, bouncing chevrons
- No broken image links — use picsum.photos or curated fashion imagery
- No AI copywriting clichés ("Elevate", "Seamless", "Next-Gen")
- No fabricated statistics or fake metric sections
- No emojis in the UI
- No custom mouse cursors
