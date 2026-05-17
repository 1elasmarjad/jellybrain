<div align="center">

# Jellybrain (WIP)

**AI co-founder for startup todos, reminders, and follow-ups.**

Jellybrain turns scattered startup work from emails, meetings, Slack, outbound campaigns, and docs into clear todos, reminders, and daily priorities.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-1.39-ee342f)](https://convex.dev/)
[![Status](https://img.shields.io/badge/status-MVP_setup-f5a623)](#roadmap)

</div>

## Table of Contents

- [About](#about)
- [Why Jellybrain](#why-jellybrain)
- [MVP Scope](#mvp-scope)
- [Product Areas](#product-areas)
- [Example Digest](#example-digest)
- [Roadmap](#roadmap)
- [AI Safety](#ai-safety)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)

## About

Jellybrain is a lightweight AI co-founder and chief-of-staff for startup teams.

The first version is a shared company todo tracker. Over time, Jellybrain should become an operating layer that connects to Gmail, Google Calendar, Instantly, Slack, and Google Drive so teams can stop manually checking every tool all day.

Jellybrain is not meant to replace a founder. It is meant to help founders notice what matters, remember what was promised, and make sure important follow-ups do not get missed.

## Why Jellybrain

Startup work gets scattered across too many places:

| Source | What gets lost |
| --- | --- |
| Email | Replies, investor follow-ups, customer asks, candidate questions |
| Calendar | Meeting prep, next steps, post-call commitments |
| Slack | Internal requests, reminders, decisions, loose ends |
| Instantly | Interested replies, stale leads, manual review items |
| Google Drive | Pitch decks, blurbs, pricing, role requirements, notes |

Jellybrain turns those scattered signals into one answer:

```txt
What needs attention today?
```

## MVP Scope

The MVP is a web app for a shared company todo list.

Core requirements:

- Create todos manually
- Assign todos to team members
- Set due dates and priorities
- Mark todos as complete
- View overdue, due today, and upcoming todos
- Attach basic company context to todos
- Show a simple team dashboard
- Produce a daily reminder digest

The first goal is not full autonomy. The first goal is to make it obvious:

- What needs to be done today
- What is overdue
- Who needs a follow-up
- What meetings need prep
- What was promised but not completed

## Product Areas

### Todo Tracker

The todo tracker is the center of the product.

Each todo should support:

| Field | Purpose |
| --- | --- |
| Title | Short action item |
| Description | Extra detail about the task |
| Owner | Person responsible |
| Status | Open, in progress, blocked, complete |
| Due date | When it needs to happen |
| Priority | How important it is |
| Related person | Investor, customer, candidate, or partner |
| Related company | Company connected to the todo |
| Related source | Gmail, Calendar, Slack, Instantly, Drive, or manual |
| Notes/context | Relevant background |

Example todos:

- Follow up with a prospective investor about intro requests
- Reply to a customer asking about onboarding
- Send the latest investor deck after a call
- Prep for an upcoming product demo
- Review interested candidate replies
- Update customer role requirements after a hiring sync

### Daily Reminder Digest

Every day, Jellybrain should remind the team what matters.

The digest can start inside the dashboard, then expand to Slack and email.

### Gmail

Gmail should detect conversations that need action:

- Someone emailed us and we have not replied
- An investor replied and needs action
- A customer sent requirements
- A candidate asked a question
- A thread has gone stale
- A founder promised to send something but no todo exists

### Google Calendar

Calendar should support meeting prep and post-meeting follow-up:

- Remind the team to prep before important calls
- Show today's meetings beside today's tasks
- Attach relevant company and person context to meetings
- Remind the team when a meeting happened but no next steps were created
- Suggest todos after meetings

### Instantly

Instantly should feed outbound and reply activity into the todo system:

- Candidate replied interested
- Investor replied
- Lead asked for more information
- Lead has not responded after a few days
- Meeting was booked
- Reply needs manual review

### Slack

Slack should become the team command center and a source of operational context.

Jellybrain should ingest relevant Slack conversations, understand what the team talks about, and turn loose commitments into reminders, suggested todos, and follow-up prompts.

Examples:

- A teammate says they will send something tomorrow
- A founder asks someone to follow up with a lead
- A customer issue is discussed but no owner is assigned
- A hiring thread mentions a candidate who needs a reply
- A meeting recap includes next steps
- A decision is made that should be attached to company context

Expected Slack features:

- Ingest selected channels and threads
- Detect commitments, asks, blockers, and follow-ups
- Create suggested todos from conversations
- Send daily reminders in Slack
- Send overdue task alerts
- Remind owners about promised follow-ups
- Create todos from Slack commands
- Mark todos done from Slack
- Answer what needs attention today

Example commands:

```txt
/add todo follow up with demo lead tomorrow
/show overdue
/what needs my attention today
/mark done send investor deck
```

### Google Drive

Google Drive should act as company memory.

Useful context sources:

- Investor blurbs
- Pitch decks
- Customer notes
- Role requirements
- Pricing
- Candidate writeups
- Outreach templates
- Internal strategy docs

The point is not just storing docs. The point is attaching the right context to the right task.

## Example Digest

```txt
Today's priorities:
1. Reply to customer onboarding thread - overdue by 1 day
2. Follow up with prospective investor - due today
3. Prep for product demo at 2 PM
4. Review 3 interested replies from Instantly
5. Send updated investor blurb
```

Example meeting prep:

```txt
Meeting today: Product demo at 2 PM

Suggested prep:
- Review last email thread
- Review company notes
- Prepare current Jellybrain blurb
```

Example context attachment:

```txt
Task: Follow up with investor

Relevant context:
- Current round terms
- Latest investor blurb
- Pitch deck
- Last conversation notes
```

## Roadmap

| Phase | Focus | Status |
| --- | --- | --- |
| 0 | Repo setup, app shell, product direction | In progress |
| 1 | Shared todo list with owners, due dates, priorities, and statuses | Planned |
| 2 | Today, overdue, upcoming, and team dashboard views | Planned |
| 3 | Daily reminder digest | Planned |
| 4 | Basic Slack reminders and commands | Planned |
| 5 | Gmail follow-up detection | Planned |
| 6 | Instantly reply tracking | Planned |
| 7 | Calendar meeting prep and follow-up suggestions | Planned |
| 8 | Google Drive company context | Planned |

## AI Safety

For the MVP, Jellybrain should be conservative.

It can:

- Create suggested todos
- Remind the team
- Summarize context
- Draft possible follow-ups
- Identify missed replies
- Highlight urgent tasks

It should not automatically:

- Send important emails
- Delete data
- Make major CRM changes
- Message customers, investors, or candidates without approval

## Tech Stack

| Layer | Tool |
| --- | --- |
| App | Next.js |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Convex |
| Package manager | pnpm |

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

If you are working on Convex functions, run Convex in a second terminal:

```bash
pnpm convex dev
```

## Project Structure

```txt
.
|-- app/                 # Next.js app routes and UI
|-- convex/              # Convex backend functions and generated types
|-- public/              # Static assets
|-- package.json         # Scripts and dependencies
|-- pnpm-lock.yaml       # Locked dependency versions
`-- README.md            # Project overview
```

## Development Notes

Useful scripts:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

When working on Convex code, read [`convex/_generated/ai/guidelines.md`](./convex/_generated/ai/guidelines.md) before changing backend functions.

When opening PRs, describe the expected product flow and how a PM can test it in simple English.
