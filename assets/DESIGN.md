---
name: Vendaia Academic Enterprise
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4d5e82'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#061b3b'
  on-primary-container: '#7284a9'
  inverse-primary: '#b5c7ef'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#341103'
  on-tertiary-container: '#af765f'
  error: '#DC2626'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b5c7ef'
  on-primary-fixed: '#061b3b'
  on-primary-fixed-variant: '#354769'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a2f00'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#f9b79d'
  on-tertiary-fixed: '#341103'
  on-tertiary-fixed-variant: '#693b27'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  success: '#16A34A'
  warning: '#F59E0B'
  info: '#2563EB'
  border-subtle: '#E5E7EB'
  surface-white: '#FFFFFF'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  caption-xs:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 24px
  sidebar-width: 220px
  header-height: 48px
---

## Brand & Style
The brand identity is rooted in **Corporate Modernism**, specifically tailored for high-density SaaS enterprise environments. It conveys a sense of rigorous organization, institutional trust, and operational efficiency. 

The aesthetic is professional and systematic, utilizing a deep oceanic primary palette to ground the interface, while using vibrant orange accents to signal interactive energy and importance. The style is characterized by high information density, clear visual hierarchies, and a utilitarian approach to interface elements that prioritizes data legibility over decorative flourish.

## Colors
The palette is dominated by **Navy Deep (#041939)** for structural elements like sidebars and headers, providing an anchor of authority. 

- **Primary:** A deep navy used for core navigation and branding.
- **Secondary:** A high-visibility orange used sparingly for active states, primary actions, and critical notifications.
- **Surface System:** Uses a sophisticated grayscale ranging from pure white for content cards to soft off-whites (`#f8f9fa`) for page backgrounds, ensuring the UI remains light and breathable despite high data density.
- **Semantic Palette:** Standardized high-contrast colors for status indicators: Emerald for active/success, Crimson for inactive/error, and Amber for pending/warning.

## Typography
**Hanken Grotesk** is the exclusive typeface, chosen for its sharp terminals and exceptional legibility in tabular data. 

The system utilizes a precise hierarchy:
- **Headlines:** Use tighter letter spacing and heavier weights to maintain impact.
- **Data Labels:** Small, all-caps treatments (`caption-xs`) are used for table headers and KPI titles to maximize vertical space.
- **Interactive Elements:** Labels use a medium weight (`500`) at 13px to balance readability with the density required for a management dashboard.

## Layout & Spacing
The system employs a **Fixed Sidebar / Fluid Content** model. 

- **Grid:** A standard 12-column system is used for dashboard layouts, but table views prioritize a single-column fluid container with horizontal overflow.
- **Rhythm:** An 8px/4px baseline grid ensures consistent vertical alignment.
- **Density:** Elements are tightly packed with 16px (gutter) internal padding within cards and 24px (margin-desktop) outer padding for the page content to prevent visual clutter.
- **Sidebar:** Fixed at 220px for high-level navigation, with a collapsible state of 64px for power users.

## Elevation & Depth
The system relies on **Tonal Layering** and **Subtle Outlines** rather than dramatic shadows.

- **Surface Levels:** The primary background sits at the lowest level (`#f8f9fa`). Content exists on white cards (`#FFFFFF`) with a 1px border (`#E5E7EB`).
- **Shadows:** Use the `shadow-sm` utility (low-offset, low-blur) exclusively for floating headers and primary content cards to provide a subtle "lift" from the background.
- **Interactivity:** Hover states are indicated by a shift to `surface-container-low` (light gray) rather than elevation changes, maintaining a flat, stable feeling for professional work.

## Shapes
The shape language is **Conservative/Soft**. 

- **Base Radius:** 4px (0.25rem) is the standard for buttons, inputs, and card containers.
- **Large Radius:** 8px (0.5rem) is reserved for larger structural components like main cards or modal containers.
- **Circular:** Reserved exclusively for user avatars and notification badges.
- **Indicators:** Active menu states use a distinct 2px vertical "pill" border on the left side of nav items to emphasize focus without occupying significant width.

## Components
- **Buttons:** Primary buttons use the secondary orange (`#FF6B01`) with white text. Icon-only buttons for utilities (print, export) use a white background with a subtle border.
- **Data Tables:** High-density, zebra-striping on hover, 13px text. Headers are sticky with a distinct background and all-caps 10px labels.
- **Inputs & Selects:** 36px height (h-9), 1px border-subtle, with 14px text. Active focus states use a secondary color border glow.
- **Status Chips:** Small, rectangular with 2px rounding. Uses 10% opacity of the semantic color for the background and 100% opacity for the text and status dot.
- **Navigation:** The sidebar uses a high-contrast theme (dark background, light text) to clearly separate navigation from the work area. Active items are highlighted with a semi-transparent overlay and a secondary color accent.