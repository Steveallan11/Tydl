# Claude Code project instructions

You are building the MVP for **Northamptonshire Cleaning Marketplace**.

## Core product rules

- This is a **managed marketplace**
- Customers book a cleaning package, not a specific cleaner
- The platform assigns the cleaner
- The platform owns pricing, support, status handling, and rebooking flow
- Phase 1 is **interior cleaning only**
- Do not invent new business rules unless absolutely necessary

## MVP priorities

1. Customer booking flow
2. Pricing calculator logic
3. Admin dashboard for assignment and status control
4. Cleaner onboarding + light cleaner portal
5. Repeat / recurring-ready structure

## Non-goals

Do not build:
- exterior cleaning in v1
- customer directory browsing
- open quote marketplace flows
- native mobile apps
- complex AI matching
- product inventory system
- overbuilt loyalty systems

## Development style

- Keep architecture simple
- Use reusable components
- Keep business logic separate from UI when sensible
- Use TypeScript properly
- Build incrementally
- Prefer a strong MVP over speculative future abstraction

## Before coding

Always review:
- `README.md`
- `docs/01-company-overview.md`
- `docs/02-commercial-model.md`
- `docs/03-service-model.md`
- `docs/05-operations-statuses.md`
- `docs/07-product-mvp-build-stack.md`
- `prompts/claude-master-build-brief.md`

## Implementation order

1. App shell + routes
2. Homepage + marketing pages
3. Booking flow + pricing logic
4. Admin dashboard
5. Cleaner onboarding + cleaner jobs
6. Rebooking / recurring-ready structure
