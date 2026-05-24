---
name: Dynamic Service Logic
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#424656'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#b21320'
  on-tertiary: '#ffffff'
  tertiary-container: '#d63135'
  on-tertiary-container: '#fff6f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The core of this design system is built upon the pillars of **efficiency, movement, and reliability**. It is designed for high-frequency utility apps where users need to process information quickly and take action with confidence. 

The aesthetic follows a **Corporate/Modern** direction infused with **Minimalism**. By stripping away unnecessary ornamentation and focusing on high-contrast functional elements, the design system ensures that real-time updates and service-critical data remain the focal point. The visual language evokes a sense of "moving parts" working in perfect sync—professional, trustworthy, and technologically advanced.

## Colors
The palette is engineered for high legibility and clear semantic signaling.

- **Primary (Action Blue):** Used for primary actions, progress indicators, and active states. It represents the "engine" of the service.
- **Secondary (Success Green):** Reserved for job completions, acceptance states, and positive confirmations.
- **Tertiary (Urgent Red):** Used for rejections, errors, and high-priority alerts that require immediate attention.
- **Neutral:** A range of deep charcoals for text to ensure maximum readability against clean white and cool-gray surfaces.

Use white for primary surfaces and light gray (#F3F4F6) for secondary containers to create clear structural separation without the need for heavy shadows.

## Typography
This design system utilizes **Inter** for its exceptional legibility in digital interfaces and its neutral, systematic character. 

The type hierarchy is optimized for scanability. Headlines use a tighter letter-spacing and heavier weights to anchor sections, while labels use a slightly increased letter-spacing to ensure clarity at small sizes. All line heights are set to a baseline grid of 4px to maintain vertical rhythm across various device sizes.

## Layout & Spacing
The layout relies on a **fluid grid system** built on an 8px base unit. 

- **Mobile:** A 4-column grid with 16px margins and 16px gutters.
- **Desktop:** A 12-column grid with a maximum content width of 1280px, centered on the screen with 48px margins.

Spacing should be generous to promote focus. Content groups should be separated by `xl` spacing, while internal component elements should use `xs` or `sm` spacing to maintain proximity and visual association.

## Elevation & Depth
In alignment with a **flat, modern UI**, depth is conveyed primarily through **tonal layers** and **low-contrast outlines** rather than heavy shadows.

- **Level 0 (Background):** White (#FFFFFF) or ultra-light gray.
- **Level 1 (Cards/Surfaces):** White surface with a 1px border (#E5E7EB) to define boundaries.
- **Level 2 (Interactive):** Subtle, highly diffused shadows (e.g., Blur: 12px, Y: 4px, 5% opacity charcoal) are reserved only for floating elements like Modals or Popovers.

This approach ensures the interface feels lightweight and "fast" to load and interact with.

## Shapes
The shape language is "Rounded," utilizing an **8px base radius** for most UI components (buttons, input fields, cards). 

- **Standard (8px):** Primary buttons, text inputs, and list items.
- **Large (16px):** Main content containers and dashboard cards.
- **Full (Pill):** Status chips and badges.

This roundedness softens the professional charcoal typography, making the efficiency of the app feel approachable rather than clinical.

## Components

### Buttons
- **Primary:** Action Blue background, white text, 8px radius. High-contrast and bold.
- **Secondary:** Transparent background, Action Blue 1px border and text.
- **Ghost:** No border, Action Blue text, for low-priority actions.

### Input Fields
- Clear 1px border (#D1D5DB) that shifts to Action Blue on focus.
- Labels are positioned above the field in `label-md` style for permanent visibility.

### Chips & Status Indicators
- Use a pill shape (Full roundedness).
- **Accepted:** Light green background with Success Green text.
- **Rejected:** Light red background with Urgent Red text.

### Cards
- White background, 1px light gray border, 16px rounded corners.
- Internal padding of 24px (`lg`) to ensure data feels organized and airy.

### Icons
- Use bold line icons with a consistent 2px stroke width. 
- Icons should match the color of the text they accompany to maintain visual hierarchy.