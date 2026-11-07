---
name: Aqarico
description: A trusted real estate product interface for search, comparison, listing management, agent verification, and market decisions.
colors:
  signal-orange: "#f97316"
  sunlit-orange: "#fb923c"
  ember-orange: "#ea580c"
  burnt-orange: "#c2410c"
  paper-sand: "#fff7ed"
  warm-card: "#fff3e0"
  grounded-cocoa: "#431407"
  clay-brown: "#9a3412"
  soft-clay-border: "#fed7aa"
  night-cocoa: "#1c1917"
  night-card: "#292524"
  dark-clay-border: "#78350f"
  verified-green: "#10b981"
  error-red: "#ef4444"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "1rem"
  xl: "2rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.warm-card}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1rem"
  button-secondary:
    backgroundColor: "{colors.paper-sand}"
    textColor: "{colors.grounded-cocoa}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.5rem"
  card-surface:
    backgroundColor: "{colors.warm-card}"
    textColor: "{colors.grounded-cocoa}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  input-default:
    backgroundColor: "{colors.paper-sand}"
    textColor: "{colors.grounded-cocoa}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
---

# Design System: Aqarico

## 1. Overview

**Creative North Star: "The Verified Property Console"**

Aqarico should feel like a calm command surface for real estate decisions: warm enough to be approachable, structured enough to handle dense property data, and fast enough to support comparison, filtering, verification, and listing management. The current system is built around a warm orange identity, rounded surfaces, compact controls, and direct action patterns.

The product must keep trust visible. Verified states, contact actions, property facts, saved items, comparison slots, and dashboard signals should be easy to identify without turning every screen into a loud sales page. The interface is allowed to have personality, but its first job is helping users decide what to do next.

It explicitly rejects generic real estate templates, repetitive card grids, plain orange SaaS styling, cluttered broker portals, luxury-only visual language, over-decorated dashboards, vague marketing copy, and interfaces that feel slow, noisy, or unfinished.

**Key Characteristics:**
- Warm marketplace identity with product-grade structure.
- Dense but scannable layouts for listings, filters, agents, and dashboards.
- Orange as an action and trust signal, not page decoration.
- Rounded, tactile controls with restrained shadows.
- Mobile-first behavior with future Arabic/RTL readiness.

## 2. Colors

The palette is warm, high-recognition, and orange-led; it must be used with discipline so Aqarico feels trusted and calm rather than basic or visually heavy.

### Primary
- **Signal Orange**: The main product action color. Use for primary buttons, active filters, price badges, verification emphasis, range sliders, scrollbars, and selected comparison states.
- **Sunlit Orange**: The brighter dark-mode action color and secondary warmth. Use when the dark theme needs enough contrast without becoming neon.
- **Ember Orange**: The deep accent. Use for gradients, featured tags, stronger emphasis, and compact badges.
- **Burnt Orange**: The gradient endpoint for hero or CTA treatments. Use sparingly; never let it dominate data-heavy screens.

### Secondary
- **Verified Green**: Use only for verified property, verified agent, success, and trustworthy completion states.
- **Error Red**: Use only for destructive, invalid, or failed states.

### Neutral
- **Paper Sand**: The light app background. It creates warmth without pure white.
- **Warm Card**: The primary light surface for cards, nav, panels, modals, and listing containers.
- **Grounded Cocoa**: The primary light-theme text color.
- **Clay Brown**: Secondary light-theme text, metadata, labels, and muted icon color.
- **Soft Clay Border**: Light-theme divider and card border.
- **Night Cocoa**: The dark app background.
- **Night Card**: The dark surface for panels and cards.
- **Dark Clay Border**: Dark-theme border and divider color.

### Named Rules

**The Orange Has a Job Rule.** Orange is for action, status, selection, or brand moments. Prohibited: filling large quiet surfaces with orange just to make the page feel designed.

**The Warmth Needs Contrast Rule.** Warm cream and orange can become low-contrast quickly. Text, controls, badges, and borders must preserve WCAG AA contrast and remain readable in mobile sunlight.

## 3. Typography

**Display Font:** Outfit, with sans-serif fallback  
**Body Font:** Outfit, with sans-serif fallback  
**Label/Mono Font:** No distinct mono family is currently defined.

**Character:** Outfit gives the system a rounded, contemporary product voice. It is friendly without becoming casual, which fits a real estate marketplace that must support trust, speed, and mixed user roles.

### Hierarchy
- **Display** (700, 2.5rem, 1.1): Use for page-level heroes and major route titles. Current pages sometimes scale to 3.75rem with Tailwind; keep that for true first-screen moments only.
- **Headline** (700, 2rem, 1.2): Use for section titles, dashboard panels, and modal headings.
- **Title** (700, 1.25rem, 1.25): Use for card titles, agent names, listing names, and panel headers.
- **Body** (400, 1rem, 1.6): Use for explanatory copy, descriptions, and readable content. Keep paragraph lines near 65-75ch.
- **Label** (600, 0.875rem, 1.2): Use for form labels, filter labels, metadata, and compact UI. Uppercase labels should be rare and short.

### Named Rules

**The Scan First Rule.** Listing and dashboard typography must support fast scanning before expressive branding. Use stronger weights for facts and actions, not decorative slogans.

## 4. Elevation

Aqarico uses a hybrid of tonal layering, borders, and restrained shadows. Cards and dropdowns are usually warm surfaces with borders; shadows appear to clarify layering, hover affordance, or sticky/floating controls such as the comparison bar.

### Shadow Vocabulary
- **Subtle Lift** (`box-shadow: 0 1px 2px rgba(0,0,0,0.03)`): Use for tiny resting elevation in light mode.
- **Panel Lift** (`box-shadow: 0 4px 6px rgba(0,0,0,0.08)`): Use for cards, search panels, and ordinary dropdowns.
- **High Lift** (`box-shadow: 0 10px 15px rgba(0,0,0,0.12)`): Use for overlays, important dropdowns, and hover states.
- **Floating Bar Lift** (`box-shadow: 0 20px 50px -10px rgba(0,0,0,0.35)`): Reserve for persistent bottom UI like comparison.

### Named Rules

**The Layer With Purpose Rule.** Shadows exist to explain stack order or interaction state. Prohibited: heavy shadows on every card at rest.

## 5. Components

### Buttons
- **Shape:** Gently rounded product controls (0.5rem) by default; larger CTAs may use 1rem to 1.5rem when they sit in spacious hero or agent surfaces.
- **Primary:** Signal Orange background with Warm Card text, medium-bold or bold label, and compact vertical padding around 0.625rem to 0.875rem.
- **Hover / Focus:** Use opacity, slight scale, or a subtle shine only for strong CTAs. Focus must be visible through border or ring treatment.
- **Secondary / Ghost / Tertiary:** Use Paper Sand or transparent backgrounds with Grounded Cocoa text and Soft Clay Border. Secondary actions should never compete with primary orange CTAs.

### Chips
- **Style:** Small rounded pills with warm tinted backgrounds, Signal Orange or Clay Brown text, and compact padding.
- **State:** Selected chips use orange borders or filled orange tint. Unselected chips stay quiet and should not create visual noise.

### Cards / Containers
- **Corner Style:** Rounded cards use 1rem for listing/search surfaces and up to 2rem for larger agent or modal treatments.
- **Background:** Light cards use Warm Card; nested content often uses Paper Sand. Dark cards use Night Card.
- **Shadow Strategy:** Use Panel Lift at rest only when it helps separate a surface. Prefer borders and tonal layering for dense lists.
- **Border:** Soft Clay Border or Dark Clay Border is the default separator.
- **Internal Padding:** Compact cards use 1rem. Larger profile, modal, and dashboard panels use 1.5rem to 2rem.

### Inputs / Fields
- **Style:** Inputs use Paper Sand backgrounds, Grounded Cocoa text, Soft Clay Border at 2px, and 0.5rem radius.
- **Focus:** Focus currently shifts to orange. Keep the interaction explicit and accessible with a visible border or ring.
- **Error / Disabled:** Error uses Error Red borders and short error text. Disabled controls should preserve layout but lower opacity and block pointer affordance.

### Navigation
- **Style:** The main nav is a fixed, warm translucent surface with light blur, compact spacing, and a centered desktop link group.
- **Typography:** Links use medium-weight Outfit, restrained size, and underline-on-hover.
- **Mobile:** Mobile navigation becomes a stacked menu with large tap targets, warm surface background, and clear currency/auth sections.
- **Theme / Currency:** Utility controls should stay compact and icon-led where possible.

### Property Card

Property cards are the primary marketplace primitive. They combine image, price, favorite/compare actions, verification, type chips, title, location, owner attribution, feature facts, amenities, and a final View Details action. The image area carries the strongest visual contrast; the content area should remain calm and scannable.

### Agent Card

Agent cards are trust surfaces. Use portrait, verification, specialization, contact options, and compact stats to support confidence. Avoid making every agent card feel like a promotional poster; verification and contact clarity matter more than decoration.

### Comparison Bar

The comparison bar is a floating decision tool. It uses blur, high lift, thumbnails, slots, and a strong Compare CTA. It should remain compact, persistent, and easy to dismiss or reset without stealing attention from listings.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Orange for primary actions, selected states, and trust-related emphasis.
- **Do** keep dense marketplace screens scannable with clear labels, compact metadata, and predictable control placement.
- **Do** preserve WCAG AA contrast, especially on warm cream and orange combinations.
- **Do** use borders and tonal layering before adding large shadows.
- **Do** make verification, contact, comparison, and saved states visible at the exact point of decision.
- **Do** keep future Arabic/RTL support in mind when arranging nav, forms, cards, maps, and dashboards.

### Don't:
- **Don't** ship generic real estate templates, repetitive card grids, plain orange SaaS styling, cluttered broker portals, luxury-only visual language, over-decorated dashboards, vague marketing copy, or interfaces that feel slow, noisy, or unfinished.
- **Don't** rely on oversized decorative cards, predictable hero sections, weak hierarchy, low-contrast warm palettes, or visual flourishes that do not help users make property decisions.
- **Don't** use orange as filler across large panels. It must signal action, status, selection, or brand.
- **Don't** use gradient text. Use solid color, scale, and weight for emphasis.
- **Don't** create nested cards. Use full-width sections, borders, or tonal rows when hierarchy gets dense.
- **Don't** use side-stripe borders as accents. Use badges, icons, full borders, or background tint instead.
