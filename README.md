# Northamptonshire Cleaning Marketplace

Managed interior-cleaning marketplace MVP for busy households in Northamptonshire.

## Product summary

This is **not** a directory and **not** an open quote marketplace.

Customers book a cleaning package with the platform.
The platform prices the job, assigns the cleaner, owns the booking flow, and pushes repeat bookings into recurring households.

## Launch scope

- Interior cleaning only
- Northamptonshire launch, operated in postcode clusters
- Core services:
  - Regular Clean
  - One-Off Clean
  - Deep Clean
  - End of Tenancy
- Add-ons:
  - Oven
  - Fridge
  - Interior windows
  - Bed change
  - Products Pack
  - Full Kit

## Build workflow

- **Claude Code** = primary builder
- **Codex** = reviews, QA, edge cases, and tests
- **Vercel** = hosting / preview deployments

## Repo purpose

This repo is a clean starter package for Claude Code to build from.
It includes:

- Product and business docs
- Pricing logic
- MVP route and screen map
- Data model outline
- Claude build brief
- Codex review checklist
- Initial app scaffold

## Suggested flow

1. Read `CLAUDE.md`
2. Read `docs/` and `prompts/`
3. Start implementation from the booking flow first
4. Keep the product aligned with the spec
