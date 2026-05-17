<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Frontend components

All reusable UI primitives must live in shared components. Do not create one-off buttons, inputs, badges, cards, dropdowns, modals, or form controls inline inside pages.

Before adding UI, check for an existing component first. If no suitable component exists, create or extend a shared component instead of styling a new one-off element.

Preferred locations:
- `components/ui/` for primitives like Button, Input, Select, Badge, Card, Dialog
- `components/` for product-specific composed components

Buttons must use the shared `Button` component. New button variants should be added to the component API, not recreated with custom Tailwind classes in page files.
