# Owocki Bounty Explorer

A lightweight, dependency-free web app for discovering active and completed ecological bounties on [owockibot.xyz](https://owockibot.xyz).

## What it does

- Fetches the live bounty board from `https://owockibot.xyz/api/bounty-board`
- Separates Open, Claimed, and Completed/Submitted work
- Search across bounty titles, descriptions, and status
- Sort by newest, oldest, or reward
- Shows reward, bounty ID, posting date, ecological/general classification, and builder/submission links
- Links back to the original bounty site or submitted build
- Responsive dark-green UI designed around the Owocki / bioregional ecosystem
- No framework or build step required

## Run locally

Because this is a static site, any static server works:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Drop the folder into Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static hosting provider. No environment variables are required.

## Data source

The app intentionally reads the public Owocki bounty-board API at runtime so the dashboard does not become stale.

## Bounty context

Built for the Owocki Bounty #470: “Bounty Explorer Dashboard”. The live board currently marks that bounty as claimed, so this repository is an implementation of the requested deliverable rather than a claim-status assertion.
