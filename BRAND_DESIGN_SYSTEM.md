# FreshDM Brand & Design System Guide
> Comprehensive Design Tokens, Color Palette, Gradients, Typography, and Logo Creation Rules for FreshDM.

---

## 1. Brand Identity Overview
- **Brand Name**: FreshDM
- **Category**: Instagram & Creator Commerce Automation
- **Core Aesthetic**: High-End Dark Glassmorphism, Midnight Violet, Precision Data Engineering, Clean Cyber-Luxury.
- **Visual Vibe**: Fast, reliable, native to Instagram dark mode while distinctively powered by FreshDM's violet intelligence engine.

---

## 2. Core Color Palette & Tokens

### Canvas & Base Surfaces
| Token | Hex / Value | Description & Purpose |
| :--- | :--- | :--- |
| **Canvas Base** | `#0A080C` | Deepest midnight canvas (near-black with a faint violet undertone). Main background for all sections. |
| **Card Surface** | `#0E0C12` | Elevated dark glass card background. Gives contrast over `#0A080C`. |
| **Elevated Surface** | `#130E1A` | Secondary highlighted surface for trending cards & active states. |
| **Instagram Dark Surface** | `#000000` | Pure pitch black used specifically for native Instagram UI simulations. |

### Brand Accents (Violet & Purple)
| Token | Hex / Value | Description & Purpose |
| :--- | :--- | :--- |
| **Primary Accent** | `#7A22B0` | Core electric violet. Used for primary CTA buttons, active card borders, and brand accents. |
| **Primary Accent Hover** | `#8E2CCB` | Slightly brighter violet on hover states and active button presses. |
| **Bright Accent** | `#A24BE0` | Vibrant data mark violet for SVG trendlines, key chart dots, icons, and live pulses. |
| **Lavender Highlight** | `#C084FC` | Soft lavender for secondary data marks, glowing rings, and pill indicators. |
| **Pale Lilac Tint** | `#D8B4FE` | Used for monospace badges, badge pill text, and active highlighted numbers. |
| **Deep Shadow Violet** | `#4C1273` | Deep shade used in bottom stops of 3D gradients and radial shadows. |

### Text & Neutral Hierarchy
| Token | Hex / Value | Description & Purpose |
| :--- | :--- | :--- |
| **Text Primary** | `#E6E3E8` | Off-white with 2% violet-silver warmth. Never pure `#FFFFFF` for body text to avoid eye fatigue. |
| **Text Pure White** | `#FFFFFF` | Reserved for high-emphasis headings, button text, and icon highlights. |
| **Text Muted** | `#8C8890` | Neutral grey for subheadings, captions, secondary timestamps, and helper text. |
| **Text Dim** | `#6E6A73` | Used for chart axis labels, month names, and subtle footer disclaimers. |

### Glass Borders & Transparencies
| Token | Value | Purpose |
| :--- | :--- | :--- |
| **Border Faint** | `rgba(255, 255, 255, 0.06)` | Subtle hairlines, table row dividers, and inner container borders. |
| **Border Default** | `rgba(255, 255, 255, 0.08)` | Standard card borders and section separation lines. |
| **Border Active** | `rgba(122, 34, 176, 0.40)` | Card hover borders and selected option states. |
| **Border Strong Active**| `rgba(162, 75, 224, 0.60)`| Active ring indicators and primary card borders. |
| **Inner Top Highlight** | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` | Simulates realistic glass top-edge light reflection. |

---

## 3. Brand Gradients

### 1. Hero / Section Backdrop Aura
```css
background: radial-gradient(
  circle at 50% 30%,
  rgba(122, 34, 176, 0.08) 0%,
  rgba(10, 8, 12, 0) 70%
);
filter: blur(140px);
```

### 2. Primary Button Gradient
```css
background: linear-gradient(
  135deg,
  #8E2CCB 0%,
  #7A22B0 60%,
  #5A1688 100%
);
box-shadow: 0 12px 32px rgba(122, 34, 176, 0.35);
```

### 3. Play Button & 3D Center Sphere
```css
background: radial-gradient(
  circle at 35% 30%,
  #A24BE0 0%,
  #7A22B0 55%,
  #4C1273 100%
);
border-top: 1px solid rgba(255, 255, 255, 0.25);
box-shadow: 0 0 40px rgba(122, 34, 176, 0.35);
```

### 4. Interactive Neon Watermark Gradient
```css
background: linear-gradient(
  90deg,
  #C084FC 0%,
  #A24BE0 30%,
  #7A22B0 60%,
  #C084FC 85%,
  #E9D5FF 100%
);
```

### 5. Bar Chart Falling Gradient
```css
/* SVG Linear Gradient (Top to Bottom) */
<linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#7A22B0" stop-opacity="0.55" />
  <stop offset="100%" stop-color="#7A22B0" stop-opacity="0.04" />
</linearGradient>
```

---

## 4. Typography System

### Primary Headings: Inter
- **Font Family**: `var(--font-sans)`, `Inter`, -apple-system, sans-serif
- **Role**: Section main titles, high-impact numbers, giant marquee text.
- **Styling**: `font-bold`, `tracking-[-0.04em]` to `tracking-[-0.03em]`, `leading-[0.98]` to `leading-[1.02]`.
- **Character**: Confident, modern, highly legible editorial.

### UI & Body Copy: Inter
- **Font Family**: `var(--font-sans)`, `Inter`, -apple-system, sans-serif
- **Role**: Subheadings, paragraphs, buttons, navigation, and badges.
- **Weights**:
  - `400 (Regular)`: Body copy and long-form descriptions.
  - `500 (Medium)`: Subheadings, navigation links, and pill badges.
  - `600 (Semi-Bold)`: Badges, table headers, and button labels.
  - `700 (Bold)`: Card titles and big statistics.

### Numbers & Metrics: Tabular Numerals
- **Class**: `tabular-nums`
- **Rule**: All counters (120K, 88K, 03%, dates, and pricing) **MUST** use tabular figures to ensure numbers never jitter during count-up animations.

---

## 5. Logo Creation Guidelines

### Logo Architecture
1. **The Wordmark**:
   - Written as **`Fresh`** in crisp white (`#E6E3E8` / `#FFFFFF`) and **`DM`** in bright electric violet (`#A24BE0` / `#7A22B0`).
   - Font: Inter 800 (Extra-Bold) with tight letter-spacing (`-0.03em`).
   - Example markup: `<span className="text-white">Fresh</span><span className="text-[#A24BE0]">DM</span>`

2. **The Icon / Glyph**:
   - Represents the intersection of an **Instagram message bubble** and a **lightning-fast automated dispatch arrow/pulse**.
   - Shapes: Continuous 1.5px or 2px precision vector strokes with rounded caps and joins.
   - Background Icon Tile: Rounded squircle (`rounded-2xl` to `rounded-[20px]`), `#0E0C12` base with a 1px border `rgba(255, 255, 255, 0.1)` and an ambient violet center glow.

### Logo Variants
- **Full Brand Header**: Full Wordmark (`FreshDM`) with left-aligned brand icon.
- **Compact Mark (Favicon / Avatar)**: 1024x1024 px square with 24% radius, dark base `#0A080C`, violet gradient brand mark (`#C084FC` -> `#7A22B0`), and subtle top specular reflection.
- **Monochrome Watermark**: Stroke-only hairline outline (`#7A22B0/40`), transparent fill, responsive SVG format.

### Logo Do's & Don'ts
- ✅ **DO** keep the background strictly dark (`#0A080C` or `#0E0C12`).
- ✅ **DO** maintain the color split: `Fresh` in white/silver and `DM` in violet.
- ✅ **DO** use round corners on all vector caps and joins.
- ❌ **DON'T** use green, yellow, orange, or rainbow gradients.
- ❌ **DON'T** use generic AI sparkle, bolt, or robot icons.
- ❌ **DON'T** place the logo on light/white backgrounds without an intentional inverted dark container.

---

## 6. Iconography Rules
- **Stroke Width**: `1.5px` (micro badges use `2px`).
- **Caps & Joins**: `strokeLinecap="round"`, `strokeLinejoin="round"`.
- **Colors**: `currentColor`, `#8C8890` (default muted), or `#A24BE0` (active/accent).
- **Approved Symbols**: Speech bubble outline, trending-up arrow, play triangle, search, checkmark, lock/shield, key, sliders.
- **Prohibited**: Cluttered 3D emojis, multi-color cartoon icons, AI sparkle stars.
