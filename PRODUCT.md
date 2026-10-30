# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo Instagram creators, creator-businesses, and small social teams who run comment-to-DM and story-mention automations. They check FreshDM between content work and sales conversations, usually on desktop for operations and on mobile for quick status checks. Their job is to know whether the automation is healthy, see what it produced, and fix or extend it without wrestling the tool.

## Product Purpose

FreshDM turns Instagram comments, story mentions, forwarded reels, and direct messages into automated private replies, public replies, captured email leads, and tracked link clicks on Meta's official Graph API. Success means the creator trusts the engine to run unattended, can prove its results, and can act on a problem or opportunity in a few seconds.

## Positioning

A self-hosted, ownership-first ManyChat alternative built directly on the official Instagram Graph API, with encrypted token storage, human-paced reply timing, and first-class lead capture. The product's proof is its operational transparency: every comment, matched keyword, sent message, response time, and click is visible in the creator's own workspace.

## Operating Context

Creators manage multiple posts and reels, tune keyword rules, pause or resume automations, preview how a rule would respond, export leads, and monitor delivery health. Accounts can expire or disconnect, so connection state and reconnect actions are part of daily operations. The application is a dark-themed web workspace with a persistent sidebar on desktop and bottom navigation on mobile.

## Capabilities and Constraints

- Comment-to-DM and comment-to-public-reply automations with contains, exact, and any-comment matching.
- Story mention responders, forwarded reel/post replies, optional email capture, link tracking, and CSV lead export.
- Live metrics: comments received, matched comments, messages sent, failures, delivery rate, link clicks, click rate, leads today, and average response time.
- Per-automation performance, searchable and filterable activity history, pagination, and a native-looking reply simulator.
- Instagram account connection, disconnection, token-expiry warnings, and reconnect guidance.
- Existing API contracts, route names, data fields, auth behavior, and destructive-action confirmation must be preserved.
- All performance numbers shown must come from the API; illustrative content must be clearly synthetic.

## Brand Commitments

FreshDM name and wordmark, the midnight-violet dark glass aesthetic, Bebas Neue display headings, Inter for interface text, tabular numerals for metrics, and the documented violet palette built on #0A080C, #0E0C12, #130E1A, #7A22B0, #8E2CCB, #A24BE0, #C084FC, and #D8B4FE. No green, yellow, orange, or rainbow brand gradients.

## Evidence on Hand

Product documentation in README.md and BRAND_DESIGN_SYSTEM.md; existing dashboard, analytics, automation, story, lead, and webhook implementations; Prisma schema; real Graph API integration; live connection and event data in the application database. No invented customer testimonials, benchmarks, or customer counts may be added.

## Product Principles

1. Prove the engine is working before asking the creator to trust it.
2. Keep the next useful action within one glance of its evidence.
3. Treat operational clarity as luxury: precise hierarchy, calm density, no decorative noise.
4. Preserve the creator's ownership and control over every automation and every record.
5. Make state changes legible: connected, paused, matched, sent, failed, and expiring must never be ambiguous.

## Accessibility & Inclusion

Existing keyboard focus treatment, skip link, semantic table structure, reduced-motion handling, and readable contrast must be preserved or improved. Motion must be non-essential and disabled under prefers-reduced-motion.
