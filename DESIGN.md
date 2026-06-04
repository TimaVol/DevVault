---
name: DevVault Design System

> **Implementation:** Runtime tokens live in `app/globals.css` (shadcn CSS variables). This file is the design reference; use `bg-background`, `text-muted-foreground`, `border-border`, etc. in UI — not legacy names like `border-subtle` or `surface-card`.
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-card: '#111111'
  border-subtle: '#1F1F1F'
  text-muted: '#8A8A8E'
  accent-lime: '#E4F222'
typography:
  display-lg:
    fontFamily: geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  button-text:
    fontFamily: geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1200px
---

## Brand & Style
The design system is engineered for a high-performance, personal developer environment. It draws heavily from the "Linear-esque" aesthetic—prioritizing extreme focus, technical precision, and a "pro-tool" atmosphere. The style is **Modern / Tech-Minimalism**, characterized by a deep, monochromatic foundation punctuated by high-vibrancy accents that signify activity and status.

The emotional response should be one of "calm control." By utilizing expansive whitespace (macro-level) and dense, information-rich components (micro-level), the system balances the need for a clean interface with the functional requirements of a developer's daily workflow. Subtle gradients, micro-interactions, and thin, high-contrast borders replace heavy shadows to create a sense of digital craftsmanship.

## Colors
The palette is rooted in a "True Dark" philosophy. The primary background uses `#131313` (`background` / `surface` tokens) to minimize eye strain while keeping depth readable. Deepest inset areas may use `#0e0e0e` (`surface-container-lowest`). Layering is achieved through varying shades of charcoal rather than transparency alone.

- **Primary & Secondary:** Electric Blue and Purple are used strictly for actionable items, primary progress indicators, and brand moments. They should frequently be used as subtle 1px gradients or glows.
- **Surface Tiers:** Use `#111111` for elevated surfaces (cards, modals) and `#1F1F1F` for borders. 
- **Accent Lime:** Borrowed from the reference aesthetic, this color is reserved for high-priority notifications or "success" states to provide a sharp break from the cool-toned palette.

## Typography
The typographic scale is designed for density and legibility. 
- **Geist** is used for headlines to provide a sharp, technical geometry that feels modern and precise.
- **Inter** handles the bulk of the reading experience, chosen for its exceptional clarity in UI contexts.
- **JetBrains Mono** is utilized for labels, metadata, and actual code snippets, reinforcing the developer-centric nature of the product.

Keep tracking (letter-spacing) tight on large display text and slightly open on mono-spaced labels for maximum readability.

## Layout & Spacing
This design system utilizes a **Fixed Grid** approach for main content areas to maintain the "workspace" feel, while sidebars and utility panels use fluid widths. 

- **The 4px Rule:** All spacing (padding, margins, gaps) must be a multiple of 4px.
- **Grid:** A 12-column grid is used for the main dashboard. On desktop, sidebars are pinned (typically 240px or 280px), and the central "vault" area expands.
- **Desktop:** 40px external margins to provide high-quality whitespace and focus.
- **Mobile:** Elements reflow to a single column with 16px horizontal margins.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows. 

1. **Floor (Level 0):** `#131313` (`background` / `surface`) — base app background.
2. **Surface (Level 1):** `#111111` (`surface-card`) — cards and secondary panels.
3. **Overlay (Level 2):** `#1c1b1b` (`surface-container-low`) — modals, dropdowns, and tooltips.

**Borders:** Use 1px solid `#1F1F1F` for all container boundaries. For active states or "hover" effects, the border can transition to the Primary Blue or a subtle white at 10% opacity.
**Inner Glow:** For primary buttons, use a very subtle top-inner-white border (0.5px) to simulate a tactile edge.

## Shapes
The shape language is **Soft (Level 1)**. 
- Standard components (buttons, inputs, cards) use a `0.25rem` (4px) radius. 
- Large containers and modals use `0.5rem` (8px). 

This relatively tight radius maintains the "technical" feel of a terminal or IDE while providing just enough softness to feel like a modern consumer app. Avoid pill-shaped buttons; stick to the standard soft-rectangles to maintain the grid-based architectural look.

## Components
- **Buttons:** High-contrast primary buttons use the Electric Blue background with white text. Secondary buttons are ghost-style with a 1px border. Always use `button-text` typography.
- **Inputs:** Darker than the surface they sit on (`#050505`). Borders should be `#1F1F1F`, turning Primary Blue on focus.
- **Chips/Badges:** Use `label-mono` typography. Backgrounds should be low-opacity versions of the accent colors (e.g., Purple at 10% opacity) with a solid text color.
- **Cards:** No shadows. Use Level 1 Surface (`#111111`) and a subtle 1px border.
- **Lists:** Use subtle dividers (`1px solid #1F1F1F`) or simply utilize the 4px vertical rhythm to separate items. Hover states should use a slight background lighten (`#161616`).
- **Command Palette:** A central component (inspired by Raycast). It should be a Level 2 Overlay, centered, with a backdrop blur on the layers beneath it.