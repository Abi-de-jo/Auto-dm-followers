---
name: FreshDM Signal Ledger
description: A midnight-violet operational workspace where live automation data reads like a precise, high-contrast ledger.
colors:
  signal-void: "#0A080C"
  signal-surface: "#0E0C12"
  signal-raised: "#130E1A"
  signal-deep: "#7A22B0"
  signal-violet: "#A24BE0"
  signal-orchid: "#C084FC"
  signal-lilac: "#D8B4FE"
  text-ivory: "#F4EFF6"
  text-mist: "#B8B1C0"
  text-muted: "#A49AAE"
  state-success: "#34D399"
  state-warning: "#FBBF24"
  state-danger: "#FB7185"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 3.05rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  hero:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(4rem, 8.6vw, 6.8rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.975rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.12em"
rounded:
  sm: "8px"
  md: "11px"
  lg: "16px"
  pill: "999px"
spacing:
  page: "clamp(18px, 2.7vw, 38px)"
  panel: "1.3rem"
  section: "1.15rem"
  cell: "1rem"
components:
  button-primary:
    background: "linear-gradient(180deg, #8E2CCB 0%, #6A1C99 100%)"
    textColor: "#FFFFFF"
    rounded: "12px"
    height: "40px"
    padding: "0 16px"
    typography: "12px / 600"
  button-secondary:
    background: "#0A080C"
    textColor: "#B8B1C0"
    rounded: "12px"
    height: "40px"
    padding: "0 16px"
    typography: "12px / 600"
  panel:
    background: "#0E0C12"
    textColor: "#F4EFF6"
    rounded: "16px"
    padding: "0"
  status-chip:
    background: "rgba(52, 211, 153, 0.10)"
    textColor: "#6EE7B7"
    rounded: "999px"
    padding: "4px 10px"
    typography: "11px / 600"
  segmented-control:
    background: "rgba(10, 8, 12, 0.72)"
    textColor: "#B8B1C0"
    rounded: "11px"
    padding: "3px"
    typography: "12px / 600"
  search-field:
    background: "rgba(10, 8, 12, 0.72)"
    textColor: "#F4EFF6"
    rounded: "11px"
    height: "40px"
    padding: "0 12px 0 36px"
    typography: "12px / 400"
  nav-item-active:
    background: "linear-gradient(180deg, rgba(162, 75, 224, 0.24), rgba(122, 34, 176, 0.16))"
    textColor: "#F4EFF6"
    rounded: "12px"
    padding: "10px 12px"
    typography: "12.5px / 500"
  section-header:
    background: "transparent"
    textColor: "#F4EFF6"
    rounded: "0"
    padding: "18px 21px"
    typography: "15.6px / 650"
---

# FreshDM Signal Ledger

## Overview

**Creative North Star: The Live Signal Ledger**

FreshDM's authenticated workspace is a command surface for Instagram automation. It should feel like a well-kept operations ledger at midnight: deep violet-black ground, crisp data, live status, and one obvious next move. The interface is dense but calm. Color is earned by state and hierarchy rather than spread across every surface.

The workspace is built from a few repeatable ideas: a fixed shell that recedes, panels with hairline borders, oversized Inter numerals against compact mono labels, and a violet signal spectrum that carries attention from page title to chart to active row. Motion confirms that data arrived or that a control responded. It does not decorate idle screens.

The result should read as premium because the information is ordered, not because the interface is loud.

**Key Characteristics**

- Midnight violet ground with layered near-black surfaces.
- Inter for page titles, large numerals, reading, and controls; JetBrains Mono for micro labels, step numbers, chart axes, legends, and table headers.
- Violet brand surfaces with a distinct chart-series palette for comments, delivered, clicks, and failures.
- Dense ledger rows, tabular numbers, and compact labels.
- Hairline borders and restrained inset highlights instead of heavy elevation.
- State-first composition: connection, delivery, failure, and next action are visible before detail.
- Fast, short motion that settles quickly and respects reduced-motion preferences.

## Colors

The palette is a controlled violet spectrum on a near-black canvas. Use value and opacity to build hierarchy before reaching for a new hue.

- **Signal Void `#0A080C`** is the page and shell ground. It keeps the workspace feeling continuous and nocturnal.
- **Signal Surface `#0E0C12`** is the default panel fill. Do not replace it with pure black or with a translucent white card.
- **Signal Raised `#130E1A`** is for inset zones, message bubbles, and selected detail areas that need one more step of separation.
- **Signal Deep `#7A22B0`** anchors gradients, active states, and the darkest violet wash.
- **Signal Violet `#A24BE0`** is the primary brand accent for focus borders, meters, active states, and live indicators.
- **Signal Orchid `#C084FC`** is for links, icon accents, and small points of emphasis inside panels.
- **Signal Lilac `#D8B4FE`** is for active labels and text that needs to sit above violet backgrounds.
- **Chart Comments `#C084FC`** is the comments series and its legend key.
- **Chart Delivered `#34D399`** is the delivered series and its legend key.
- **Chart Clicks `#FBBF24`** is the clicks series and its legend key.
- **Chart Failed `#FB7185`** is the failed series and its legend key.
- **Text Ivory `#F4EFF6`** is the primary reading color. It is warm enough to avoid the flatness of pure white.
- **Text Mist `#B8B1C0`** is for descriptions, secondary values, and supporting copy.
- **Text Muted `#A49AAE`** is for uppercase labels and quiet metadata.
- **Hairline `rgba(255,255,255,0.075)`** is the default divider and panel border. Stronger violet hairlines use `rgba(216,180,254,0.2)`.

**The Violet Brand Rule.** Violet is the brand. It can move from deep to pale across gradients and surfaces. Emerald, amber, and rose remain semantic colors for connected, warning, and failure states.

**The Chart Series Rule.** Charts are the one place where non-violet hues may carry meaning. Use Comments Orchid `#C084FC`, Delivered Emerald `#34D399`, Clicks Amber `#FBBF24`, and Failed Rose `#FB7185`. These are data encodings, not general accents. Every series must also carry a text label in the legend or tooltip. Do not use green or yellow as decorative highlights outside a chart or a semantic state.

**The Tinted Ground Rule.** Large violet fields are gradients or low-opacity washes, not flat saturated purple blocks. The page ground stays `#0A080C` or `#0E0C12`; violet atmosphere comes from radial washes and layered surfaces, never a full-page purple fill.

Do not use the legacy indigo tokens from `theme.css` (`--primary`, `--sidebar`, `--background`, and related chart tokens) for workspace surfaces. The Signal Ledger uses the `--signal-*` variables in `workspace.css` or the corresponding explicit hex values. The old tokens remain for non-workspace surfaces only.

## Typography

Inter supplies the operational display voice and every word that has to be read quickly and accurately. JetBrains Mono supplies the instrument-panel voice for labels, numbers, and chart chrome.

- **Display / page title:** Inter, `clamp(2rem, 3.2vw, 3.05rem)`, 700, line-height `0.98`, tracking `-0.035em`, sentence case. Use for page titles only.
- **Hero numeral:** Inter, `clamp(4rem, 8.6vw, 6.8rem)`, 700, line-height `0.9`, tracking `-0.05em`. Use once per page for the primary value.
- **Section title:** Inter, `0.975rem`, 650, line-height `1.3`, tracking `-0.012em`.
- **Body / table text:** Inter, `0.8125rem`, 400 to 600, line-height `1.5`. Table figures use tabular numerals.
- **Micro label:** JetBrains Mono, `0.6875rem`, 600, line-height `1.35`, tracking `0.1em`, uppercase. Use for metadata, field labels, chart legends, axes, table headers, and step numbers.
- **Data label:** JetBrains Mono, `0.75rem` to `0.8125rem`, 500 to 600, tabular numerals. Use for values that need to read as instrument output.

**The Two-Voice Rule.** Inter is for scale, identity, reading, controls, and explanations. JetBrains Mono is for the small, precise labels that make the workspace feel measured. Do not use display type below roughly 20px; at that size it loses its authority and becomes harder to scan than body Inter.

Numbers are part of the visual language. Use `font-variant-numeric: tabular-nums` or the `tabular-nums` utility wherever values align vertically or change over time. Do not tighten body tracking. Do not use more than two weights in a single dense panel unless hierarchy demands it.

## Layout

The desktop shell is a fixed `17rem` sidebar beside a fluid main column. The sidebar holds the brand, account, workspace navigation, live connection state, and the primary create action. Main content has no page-level max-width; rhythm comes from `clamp(18px, 2.7vw, 38px)` page padding and consistent panel gaps.

- Page header: title block on the left, actions on the right, metadata strip below, separated by a hairline rule.
- Dashboard hero: a large signal panel with a `1.55fr / 0.9fr` split. The left side carries the hero numeral and trend; the right side carries engine health.
- Dashboard metrics: a six-column strip on desktop, two columns on mobile, separated by vertical hairlines rather than individual cards.
- Main workspace grid: the chart occupies the wide column; the conversion pulse sits in a narrower, equal-height side panel. Use `items-stretch` and flex columns so both cards share the same top and bottom edge.
- Ledger: full-width panel with toolbar, search, table header, rows, and pagination. Rows read left to right as identity, comment, matched signal, delivery, clicks, time.
- Analytics: a weekly hero, quality meters, a four-up metric strip, a chart with a time-range switch, and a ranked rule-performance table.
- Instagram: a connect state or a rule summary, then a two-column master-detail layout. The rule list scrolls independently; the detail panel stays sticky on desktop.

On mobile, the sidebar is replaced by a sticky top bar and a five-item fixed bottom navigation. Main content adds bottom padding equal to the navigation height plus the safe-area inset. Do not let the fixed navigation cover the final row or action.

**The Ledger Order Rule.** A ledger row always resolves identity, signal, delivery state, and time in the same reading order. Do not reorder columns by page or by data availability. If a value is absent, preserve the column and show a quiet placeholder.

Tables may scroll horizontally inside their panel on narrow screens. The page itself must not. Always keep the row identity visible enough that the user knows which record is moving.

Spacing is compact but not cramped. Panel sections use `1.15rem` to `1.3rem` padding. Cells use roughly `1rem`. Keep at least `0.85rem` between major panels. When in doubt, add separation through a hairline or a surface step before adding a larger gap.

## Elevation

Depth is mostly drawn with borders, surface value, and inset light. Avoid floating cards and large drop shadows.

- Default panel: `1px` hairline, radius `16px`, `box-shadow: inset 0 1px 0 rgba(255,255,255,0.055)`.
- Raised inset: same hairline family with a slightly lighter or more violet fill.
- Modal / sheet: `0 32px 100px rgba(0,0,0,0.7)` plus a `1px` inner highlight. This is the one place for a deep shadow.
- Focus: `0 0 0 3px rgba(162,75,224,0.12)` on inputs and interactive fields. Focus rings are functional and may be zero-offset.
- Status dots: use a small offset glow (`0 1px 6px`), not a zero-offset colored halo.
- Meter fills: a soft offset glow is permitted at low opacity. Do not stack multiple glows on the same element.

**Motion.** Entrance motion uses `fadeSlideIn`: `opacity 0 → 1` and `translateY(16px) → 0` over `800ms`, with delays from `100ms` to `500ms`. Ledger rows may fade in with a `340ms` rise and `24ms` stagger. Charts animate in `650ms` to `850ms`. Meter widths and progress fills use `700ms` with an ease-out curve. Hover and focus transitions stay between `160ms` and `180ms`. Live dots may ping continuously with a low-opacity pulse.

Do not animate layout properties, page-wide parallax, or long decorative sequences. Under `prefers-reduced-motion`, the workspace reduces all animation and transitions to near-zero while keeping the final state visible.

## Shapes

The shape language is precise and slightly softened. Nothing is sharp enough to feel brutal; nothing is round enough to feel playful.

- Panels: `16px`.
- Buttons and larger controls: `12px`.
- Inputs and segmented controls: `11px`.
- Small badges and icon chips: `8px` to `10px`.
- Status pills: `999px`.
- Avatars: full circle.
- Media thumbnails: `10px` with a dark inset ground.
- Message bubbles: `14px` with the bottom-left corner reduced to `4px`.

Borders are always `1px`. Do not use a thick border as the main separator. If a surface needs more emphasis, raise its value, add a violet tint, or strengthen the hairline to the violet line color. Avoid mixing several corner radii in one component unless the asymmetry has a clear conversational or directional purpose.

## Components

- **Primary button:** violet vertical gradient, white 12px semibold label, `12px` radius, `40px` height, subtle inset top light and a soft violet ambient shadow. Hover lifts the gradient one step; disabled drops opacity to 50% and removes pointer events.
- **Secondary button:** `#0A080C` ground, white hairline, mist text, `12px` radius. Hover brings a low-opacity violet wash and a violet border. Use for refresh, filters, and non-destructive secondary actions.
- **Panel:** `#0E0C12`, `16px` radius, hairline border, inset top highlight. The panel is the default container; do not wrap every subsection in its own card.
- **Status chip:** pill shape, `4px 10px` padding, 11px semibold text. Green means connected or delivered, amber means warning or pending, rose means failed, violet means brand or neutral emphasis. Always pair color with a text label.
- **Segmented control:** dark inset track with `3px` padding and `11px` radius. The active segment uses the violet gradient and ivory text; inactive segments stay mist. Keep controls short and equal-width.
- **Search field:** dark inset ground, hairline border, leading magnifier icon, `40px` height. Focus shifts the border toward violet and adds the focus ring. Never rely on placeholder text as the only label.
- **Active navigation item:** violet-tinted gradient, left-edge glow or inset highlight, ivory label, lilac icon. Inactive items are mist and gain only a quiet surface on hover. The create action is visually distinct from navigation.
- **Section header:** transparent, hairline bottom border, `18px 21px` padding. Leading icon chip, 15.6px section title, 13px supporting copy, optional action on the right. Keep one idea per header.

The visual sidecar at `components/signal-ledger.html` demonstrates the primary button, secondary button, panel, status chip, segmented control, search field, active navigation item, and section header. Use it as a rendering reference, not as a separate framework.

## Do's and Don'ts

**Do**

- Lead with state. Show connection, delivery health, and the next action before secondary detail.
- Use the violet spectrum for hierarchy and semantic colors for meaning.
- Use tabular numerals for metrics, times, rates, and anything that aligns in a column.
- Keep panels quiet and let data carry the contrast.
- Use the `--signal-*` tokens or the explicit Signal Ledger hex values for workspace surfaces.
- Keep text contrast high: ivory on void, mist on surface, muted only for small metadata.
- Use horizontal scrolling inside wide ledgers on mobile while keeping the page itself fixed.
- Respect reduced motion and ensure interactive states remain visible without animation.
- Pair every semantic color with a label or icon so meaning does not depend on hue alone.

**Don't**

- Don't use green, amber, or rose as brand accents or decorative gradients.
- Don't use the legacy indigo palette for workspace panels, charts, or navigation.
- Don't set body copy or form labels in Anton.
- Don't use pure white or pure black as large surfaces.
- Don't add zero-offset colored halos to dots, chips, or panels; use offset soft shadows only.
- Don't stack multiple glows, heavy shadows, or thick borders to create importance.
- Don't animate width, height, top, left, or other layout properties.
- Don't let the mobile fixed navigation cover content without compensating bottom padding.
- Don't reorder ledger columns or hide absent data by changing the reading order.
- Don't use violet for success, warning, or failure when a semantic state color is required.
