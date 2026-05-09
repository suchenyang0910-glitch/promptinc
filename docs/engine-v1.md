# PromptInc Engine V1

## Goal
Build a configuration-driven game platform where one JSON file can create:
- A playable game page
- SEO metadata and structured data
- Guide page content blocks
- Leaderboard hooks
- Ads placement hooks
- Analytics events

V1 focuses on the Idle Engine (PromptInc/CryptoInc) first, then expands to other templates.

## Content Location
- `content/games/*.json` defines games
- `games/*.ts` may wrap/transform content into runtime `GameConfig`

## JSON Schema (Idle Game Content V1)

Required fields
- `slug`: string
- `gameType`: `"idle"`
- `gameName`: string
- `description`: string
- `shortDescription`: string
- `category`: string
- `emoji`: string
- `currencyName`: string
- `clickButtonText`: string
- `milestones`: `{ money: number; title: string }[]`
- `upgrades`: `{ id: string; name: string; baseCost: number; income: number }[]`

Optional fields
- `tags`: string[]
- `seo`: `{ title: string; description: string }`
- `faq`: `{ q: string; a: string }[]`
- `luck`: `{ enabled: boolean; criticalChance: number; criticalMultiplier: number; luckyNames: string[] }`

## Page Standards

Every game must have
- `/games/{slug}`
- `/games/{slug}/guide`
- `/games/{slug}/leaderboard`
- `/games/{slug}/opengraph-image`

Every game page must include
- About
- How to Play
- Tips & Strategy
- FAQ
- Related Games

## Ads Standards

V1 uses slot placeholders. Ads are selected by scene + slot id.
- `banner`: header/footer areas
- `inline`: between content blocks
- `gameover`: game over + interstitial

Interstitial policy (V1)
- Cooldown: 3 minutes
- Session max: 3

## Analytics Standards

Events (V1)
- `game_view`, `game_start`, `game_pause`, `game_reset`, `game_over`
- `score_submit`
- `ad_impression`, `ad_interstitial_shown`
- `daily_bonus_claim`

