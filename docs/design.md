---
name: Standard Industrial Safety System
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#44474b'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#75777b'
  outline-variant: '#c5c6cb'
  surface-tint: '#595f67'
  primary: '#070d13'
  on-primary: '#ffffff'
  primary-container: '#1d232a'
  on-primary-container: '#848a93'
  inverse-primary: '#c1c7d0'
  secondary: '#006d36'
  on-secondary: '#ffffff'
  secondary-container: '#93f5ab'
  on-secondary-container: '#007238'
  tertiary: '#160a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#351d00'
  on-tertiary-container: '#c37900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde3ec'
  primary-fixed-dim: '#c1c7d0'
  on-primary-fixed: '#161c23'
  on-primary-fixed-variant: '#41474f'
  secondary-fixed: '#96f7ad'
  secondary-fixed-dim: '#7adb93'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#ffb865'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#663d00'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for the high-stakes environment of Brazilian Occupational Health and Safety (SST). The personality is **authoritative, rigorous, and industrial**, prioritizing the rapid identification of risk and compliance status over decorative elements.

The aesthetic follows a **Modern Industrial** approach: a synthesis of Corporate efficiency and technical utility. It utilizes high-contrast interfaces to ensure legibility in various lighting conditions (from corporate offices to factory floors). The emotional response should be one of "controlled precision"—users must feel that the data is accurate, the deadlines are critical, and the safety of the workforce is paramount.

## Colors
The palette is derived directly from international and Brazilian safety signaling standards (NR-26).

- **Inert Structure (#1d232a):** Used for primary navigation, headers, and core text. It provides a heavy, "iron-clad" foundation.
- **Signal Green (#0b7a3e):** Indicates "Conformity" and "Safety." Use this for positive actions and verified status.
- **Amber Warning (#c77c02):** Indicates "Pending," "Warning," or "Near Deadline." It demands attention without signaling immediate failure.
- **Signal Red (#c0392b):** Reserved strictly for "Non-Compliance," "Danger," or "Critical Overdue" items.
- **Backgrounds:** Use a very light neutral gray (#f2f4f7) for the application canvas to reduce eye strain while maintaining high contrast against the dark graphite text.

## Typography
The typographic hierarchy uses a "functional pairing" logic.

**Barlow Condensed** is used for all structural headings and data identifiers. Its narrow width allows for dense information display in tables and dashboards while its verticality mimics industrial signage. Use uppercase for high-level headers to increase the "official" tone.

**Inter** is the workhorse for all instructional text, data entry, and reports. It is chosen for its exceptional legibility at small sizes, which is critical for reading complex safety regulations and technical descriptions on mobile devices.

## Layout & Spacing
This design system utilizes a rigorous **8px grid system** (with 4px sub-steps) to reinforce the mechanical, organized nature of industrial management.

- **Grid Model:** 12-column fluid grid for desktop; 4-column for mobile.
- **Density:** High density. Elements should feel compact and efficient.
- **Vertical Rhythm:** Use 8px/16px increments for vertical stacking of form fields and list items to maintain a disciplined structure.
- **Safe Areas:** On mobile devices used in the field, ensure a minimum touch target of 44px, even if the visual element is smaller.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layering** and **Structural Outlines** rather than soft shadows. This avoids a "dreamy" look, favoring a "flat-technical" look.

- **Levels:** Surfaces do not "float"; they are "stamped" or "milled" into the UI.
- **Borders:** Use 1px solid borders (#d1d5db) for containers.
- **Status Rails:** The primary depth indicator for critical items is a 4px solid vertical "rail" on the left edge of cards. The color of this rail (Green, Amber, or Red) dictates the priority and elevation of the information.
- **Active State:** Use a subtle inset shadow or a slightly darker background tint to indicate a pressed or active button state, mimicking physical industrial switches.

## Shapes
Shapes are **Rounded (0.5rem)**. This provides a balance between technical structure and modern user interface standards, softening the industrial aesthetic slightly for improved ergonomics.

- **Standard Radius:** 8px for buttons, input fields, and cards.
- **Large Radius:** 16px for modal containers and primary dashboard widgets.
- **Pill Shapes:** Used exclusively for Status Badges (Chips) to differentiate them from actionable buttons and structural containers.

## Components

### Buttons
- **Primary:** Background #1d232a, Text White. Standard corners (8px radius).
- **Status-Driven:** In specific contexts (e.g., "Resolve Non-Conformity"), buttons may use Signal Green.
- **Visual Style:** Solid fills, no gradients. Focus states must have a high-contrast 2px offset ring.

### Cards & Status Rails
- All cards for inspections, incidents, or tasks must include a **Left Rail Border** (4px width).
- The rail color must match the status: Red for "Critical/Open", Amber for "In Progress", Green for "Resolved".

### Inputs & Form Fields
- Labels should use `label-bold` in uppercase for a "Form-fill" technical feel.
- Inputs have a 1px border. On focus, the border thickens to 2px in Graphite (#1d232a).

### Badges (Chips)
- Use pill-shaped containers for status.
- **Subtle Mode:** For non-critical data, use a light tint of the status color with dark text.
- **Urgent Mode:** For danger/overdue, use solid Signal Red with white text.

### Data Tables
- Header row background: #1d232a with white text (Barlow Condensed).
- Row height: 48px (Standard) or 40px (Compact).
- Vertical lines are omitted; use subtle horizontal dividers only.

### Specialized Components
- **The "Safety Gauge":** A circular or semi-circular indicator showing the percentage of "Conformity" (Signal Green vs Signal Red).
- **Incident Icons:** Standardized industrial pictograms (ISO 7010) used alongside labels for rapid recognition of hazard types (Electrical, Fall, Chemical).
