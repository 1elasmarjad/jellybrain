---
name: Electric Horizon
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#4e565d'
  on-tertiary: '#ffffff'
  tertiary-container: '#676e76'
  on-tertiary-container: '#eaf1fa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#dce3ec'
  tertiary-fixed-dim: '#c0c7d0'
  on-tertiary-fixed: '#151c23'
  on-tertiary-fixed-variant: '#40484f'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system embodies a **Corporate Modern** aesthetic with a high-energy, technical edge. It is designed for high-growth SaaS and fintech platforms that require a balance of established reliability and forward-thinking innovation. 

The visual language is characterized by precision, clarity, and "digital-first" vibrancy. By utilizing a "blue-ish" monochrome-leaning palette, the UI evokes feelings of intelligence, efficiency, and limitless scale. Whitespace is used strategically to maintain focus, while subtle depth effects provide a sense of sophisticated architecture.

## Colors
The palette is anchored by **Electric Blue**, a high-chroma primary shade that demands attention and signifies action. Supporting this are lighter sky-tints for interactive states and deep navy neutrals for typography and structural grounding.

- **Primary (Electric Blue):** #2563EB — Used for main CTAs, active states, and brand identifiers.
- **Secondary (Aero Blue):** #3B82F6 — Used for secondary accents and hover states.
- **Surface (Ghost Blue):** #EFF6FF — A very light, clean blue used for background sections and card surfaces to replace standard grays.
- **Neutral (Ink):** #0F172A — A deep, blue-toned dark shade for high-contrast text and borders.
- **Status Colors:** Use standard semantic greens and reds, but tinted slightly with blue to maintain harmony with the core palette.

## Typography
The typography utilizes **Plus Jakarta Sans** to provide a friendly yet professional demeanor. Its wide apertures and modern geometric construction make it highly legible for both data-heavy interfaces and bold marketing headlines.

Headlines should use tighter letter spacing and heavier weights to emphasize the "Electric Blue" brand energy. Body text maintains a generous line height to ensure readability against the light blue tinted surfaces.

## Layout & Spacing
The layout follows a strict **8px soft grid** system. Components and layouts should always snap to increments of 8px to maintain visual rhythm and mathematical harmony.

- **Desktop:** 12-column fluid grid with 24px gutters.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters.

Apply "Internal Content Padding" using the primary unit (e.g., 16px or 24px) to ensure elements within cards do not feel cramped. Large sections of content should be separated by 64px or 80px to lean into the minimalist philosophy.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows**. Instead of pure black shadows, use "Tinted Shadows" — shadows that incorporate a fraction of the primary blue (#2563EB) at very low opacities (e.g., 8-12%).

- **Level 0 (Base):** Standard background (#FFFFFF) or light surface (#EFF6FF).
- **Level 1 (Cards):** White surface with a 1px border of #DBEAFE and a soft, diffused shadow.
- **Level 2 (Dropdowns/Modals):** White surface with a more pronounced shadow and a subtle backdrop blur (8px) on the layers beneath.
- **Interactive:** Elements should appear to "lift" on hover, increasing shadow spread and slightly brightening the blue fill.

## Shapes
Following the "Round Eight" philosophy, the standard corner radius is **0.5rem (8px)**. This creates a UI that feels approachable and modern without being overly "bubbly."

- **Standard (Components):** 8px (rounded-md)
- **Large (Containers/Cards):** 16px (rounded-lg)
- **Extra Large (Hero Sections):** 24px (rounded-xl)
- **Icons:** Should follow a similar rounded aesthetic, avoiding sharp 90-degree joins.

## Components

### Buttons
Primary buttons use the **Electric Blue** (#2563EB) fill with white text. They should have an 8px radius. Secondary buttons should use a Ghost Blue (#EFF6FF) background with Electric Blue text, providing a clear hierarchy without visual clutter.

### Input Fields
Inputs feature a 1px border in a light blue-gray. On focus, the border transitions to Electric Blue with a subtle 3px outer glow (ring) in a semi-transparent primary blue.

### Cards
Cards are the primary container. Use a white background, 16px corner radius, and a 1px border (#DBEAFE). For featured content, a subtle vertical gradient from #EFF6FF to #FFFFFF can be used to draw the eye.

### Chips & Tags
Used for categorization. These should have a pill-shape (full rounding) and utilize low-contrast blue backgrounds with high-contrast navy text to remain legible but secondary.

### Data Lists
Lists should avoid heavy dividers. Instead, use alternating row tints of #EFF6FF or simple whitespace to define boundaries, keeping the interface feeling open and light.