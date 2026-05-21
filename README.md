# Logistics Paperwork Calculator

A Next.js app that helps logistics teams (brokers, 3PLs, customs brokers, fleets) quantify what manual document review is actually costing them. Plug in your docs per month, minutes per doc, hourly wage, and rejection rate — see your current spend, what an optimized platform would cost, and what a future AI auto-review setup looks like.

## Formula

For each workflow profile (manual, legacy TMS, modern TMS, outsourced, our platform, AI auto-review):

```
effectiveMinutesPerDoc = minutesPerDoc * timeMultiplier
rejectionPct           = profile override (if set) else userRejectionRate
baseMinutes            = docsPerMonth * effectiveMinutesPerDoc
reworkMinutes          = baseMinutes * rejectionPct / 100
laborCost              = (baseMinutes / 60) * hourlyWage
reworkCost             = (reworkMinutes / 60) * hourlyWage
monthlyCost            = laborCost + reworkCost + softwareCostMonthly
```

Rejected documents force a re-review, so they effectively double-count toward labor. Savings are computed as the delta between the current workflow and `ourPlatform`, multiplied by the number of employees.

## Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Recharts (bar + line charts)
- Framer Motion (entrance animations)
- jsPDF (downloadable PDF report)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` — start the dev server with hot reload
- `npm run build` — production build
- `npm start` — run the production server (after `build`)
- `npm run lint` — lint the codebase

## Customize

Workflow profiles, default inputs, and presets live in [`lib/constants.ts`](./lib/constants.ts):

- `WORKFLOWS` — the six workflow profiles (`manual`, `legacyTms`, `modernTms`, `outsourced`, `ourPlatform`, `aiAutomated`). Each has a `timeMultiplier`, optional `rejectionRateOverride`, `softwareCostMonthly`, `setupCost`, `trainingCost`.
- `WORKFLOW_COLORS` — chart colors per workflow.
- `DEFAULT_INPUTS` — the initial form state.
- `LOGISTICS_PRESETS` — the quick-fill preset buttons (Small Broker / Mid-Size Broker / Customs Broker / Fleet).

Math lives in [`lib/calculations.ts`](./lib/calculations.ts).
