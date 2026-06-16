# Handoff: Guardianship Expense Tracker — Direction A ("Calm & Rounded")

## Overview
A phone-first expense tracker for a **court-appointed guardian/conservator** managing another person's money (here: a wife managing her husband's care account; he has Alzheimer's). The app's jobs: see the account balance and recent spending at a glance, log expenses with the fewest steps, capture receipts by photo, and produce a filing-ready **court accounting** report.

The whole design is optimized for **older users**: very large type, high contrast, big tap targets (≥56px), plain language, and minimal steps per task.

This package documents **Direction A** only (the soft-blue, rounded direction the user chose).

## Screen previews
Static renders of the four screens you are implementing live in `screens/`. **These are the visual source of truth** — match them.

| # | Screen | Image |
|---|---|---|
| 1 | Home / Dashboard | `screens/01-home.png` |
| 2 | History | `screens/02-history.png` |
| 3 | Scan receipt | `screens/03-scan-receipt.png` |
| 4 | Court report | `screens/04-court-report.png` |

> The phone bezel and status bar (`9:41`, signal icons) in these renders are just the preview frame — **do not build them**; your platform provides them. Implement only the screen content. The History and Court report screens scroll; the renders show the top of each — see the per-screen specs below for the full content.

## Using this with Claude Code
Claude Code builds from whatever you give it — with no concrete target it will invent its own generic UI. To get an app that matches these screens, do this:

1. **Put this whole `design_handoff_guardianship_tracker/` folder in (or beside) your repo** so Claude Code can read the README *and* see the `screens/` images.
2. **Paste a prompt like this:**
   > Read `design_handoff_guardianship_tracker/README.md` and look at the four images in `design_handoff_guardianship_tracker/screens/`. Implement **Direction A** of this guardianship expense tracker in our existing codebase, matching the screen renders and the exact design tokens in the README (colors, typography, spacing, radii). Reuse our existing components and design system where equivalents exist; only add new styles where the spec has no match. Build the four documented screens first; stub the screens listed under "Gaps" to match the same patterns. Don't build the phone bezel/status bar — the platform provides those.
3. **Point it at your design system.** If your repo already has tokens/components, tell Claude Code to map the README's tokens onto them rather than hand-rolling new ones — this is the single biggest factor in whether the result looks consistent with the rest of your app.
4. **Iterate screen-by-screen.** Implement Home, compare against `screens/01-home.png`, correct drift, then move on. Asking Claude Code to match one screen at a time gives far closer results than "build the whole app."

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior. They are **not production code to copy directly**. Your task is to **recreate these screens in the target app's existing environment** (React, SwiftUI, Flutter, etc.) using its established components, navigation, and styling patterns. If no environment exists yet, pick the most appropriate framework for a mobile app and implement there.

The HTML uses a generic iOS device frame (`ios-frame.jsx`) purely to preview the screens on a phone — **ignore the bezel/status bar**; your platform provides those. Implement only the screen content inside each frame.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and layout are specified below with exact values. Recreate the UI to match, mapping these tokens onto the codebase's existing design system where equivalents exist.

---

## Design Tokens (Direction A)

### Colors
| Token | Hex | Use |
|---|---|---|
| `bg/page` | `#F4F7FB` | Screen background (soft blue-white) |
| `surface/card` | `#FFFFFF` | Cards, list containers, tab bar |
| `ink/primary` | `#16263F` | Primary text, balances, amounts |
| `ink/muted` | `#5B6B82` | Secondary text, labels, captions |
| `ink/disabled` | `#8A98AC` | Inactive tab labels/icons |
| `brand/primary` | `#2F62D9` | Primary buttons, active tab, links, accents |
| `brand/tint` | `#E7EFFD` | Avatar bg, medical category tile, soft fills |
| `brand/tint-strong` | `#EEF3FB` | Summary strip background |
| `border/hairline` | `#E3EAF4` | Card borders |
| `border/divider` | `#EDF1F8` | Row dividers inside cards |
| `border/btn-outline` | `#CBD9F0` | Secondary (outline) button border |
| `positive` | `#1F8A5B` | "✓ Receipt", closing balance, status dot |
| `warning` | `#B57E1F` | "Needs receipt" flag, warning text |
| `warning/bg` | `#FFFBF2` | Flagged-row background tint |

#### Category accent colors (tile bg / tile text)
| Category | Letter | Tile bg | Tile text |
|---|---|---|---|
| Medical & Care | M | `#E7EFFD` | `#2F62D9` |
| Care Services | C | `#E2F2F1` | `#2E8B8B` |
| Groceries | G | `#E6F4E9` | `#2F8B45` |
| Utilities | U | `#F7EEDD` | `#B57E1F` |
| Housing | H | `#ECEAF8` | `#6A5AC0` |
| Personal | P | `#F8E9EF` | `#C45D7C` |

### Typography
- **Font family:** `Public Sans` (Google Fonts) for everything. Fallback: `system-ui, sans-serif`. (Public Sans is highly legible and was chosen for older readers.)
- **Numbers:** always `font-variant-numeric: tabular-nums` for balances/amounts so columns align.

| Role | Size / Weight | Notes |
|---|---|---|
| Hero balance | 46px / 800, `letter-spacing:-1px` | Dashboard balance |
| Screen title | 30px / 800 | "History", "Court report" |
| Greeting | 23px / 800 | "Good morning, Margaret" |
| Section heading | 19px / 800 | "Recent activity" |
| Row title (merchant) | 17–18px / 700 | List rows |
| Body / labels | 15–16px / 600 | Muted metadata |
| Amount | 17–18px / 800 | Right-aligned, tabular |
| Status chip | 13px / 700 | "✓ Receipt" / "+ Add receipt" |
| Tab label | 12px / 700 | Under tab icon |
| Date group label | 14px / 700, uppercase, `letter-spacing:0.5px` | "Today", "Earlier this week" |

### Spacing, radius, shadow
- **Screen padding:** 22px horizontal.
- **Card radius:** 24px (hero/balance), 20–22px (list/section cards), 16–18px (buttons, summary strip), 12–13px (category tiles, small chips).
- **Card border:** `1px solid #E3EAF4`.
- **Card shadow (hero only):** `0 6px 20px rgba(22,38,63,0.06)`.
- **Primary button shadow:** `0 6px 16px rgba(47,98,217,0.28)`.
- **List row vertical padding:** 15–17px. **Min tap target ≈ 56px.**
- **Category tile:** 44×44 (lists), 46×46 (history), 36×36 (report rows), radius 10–13, centered bold letter.
- **Avatar:** 50×50 circle, `brand/tint` bg, `brand/primary` letter.

### Icons
Simple line icons, 24–26px, `stroke-width:2`, `stroke-linecap/linejoin:round`, color = `currentColor`:
- **Home:** roof path `M3 11l9-8 9 8` + body `M5 10v10h14V10`
- **History:** three lines `M4 7h16 / M4 12h16 / M4 17h11`
- **Receipts/Camera:** `rect 3,7 18×13 rx3` + `circle 12,13.5 r3.3` + lens `M8 7l1.5-2.5h5L16 7`
- **Reports/Doc:** `rect 5,3 14×18 rx2.5` + lines `M9 8h6 / M9 12h6 / M9 16h4`

Use your platform's icon set if it has equivalents; exact glyphs are not critical.

---

## Screens / Views

### 1. Home / Dashboard
![Home](screens/01-home.png)
**Purpose:** At-a-glance balance + recent activity, and one-tap access to the two core actions.

**Layout (top → bottom):**
1. **Top bar** (padding `64px 22px 10px`): left = date label (`Tuesday, June 16`, 15/600 muted) over greeting (`Good morning, Margaret`, 23/800 ink); right = 50px circular avatar "M".
2. **Scroll area** (padding `6px 22px 0`, vertical gap 16px):
   - **Balance card** (white, radius 24, padding 24, hero shadow): label `Robert's Care Account` (15/600 muted); balance `$12,480.55` (46/800); status row = 9px green dot + `Available · updated today`; hairline divider; footer row `Spent this month` ↔ `$1,847.20` (18/800).
   - **Quick actions row** (gap 12): **Add expense** — filled primary button, height 68, radius 18, white 18/800 text, leading `+` glyph, primary shadow. **Scan receipt** — white button, `2px` outline `#CBD9F0`, primary text, leading camera icon.
   - **Section header:** `Recent activity` (19/800) ↔ `See all` (15/700 primary).
   - **Recent activity card** (white, radius 22, hairline border): 4 rows, dividers `#EDF1F8` between. Each row = 44px category tile (letter) + [merchant 17/700, `category · date` 14/600 muted] + right column [amount 17/800, status chip]. Status chip: `✓ Receipt` (green) or `+ Add receipt` (warning).
3. **Bottom tab bar** (white, top border hairline, padding `10px 8px 30px`): 4 tabs evenly spaced — Home (active=primary), History, Receipts, Reports (inactive=`#8A98AC`). Icon over 12/700 label.

**Sample data:** Riverside Pharmacy · Medical & Care · Today · $84.30 · ✓; Sunrise Home Care · Care Services · Jun 14 · $640.00 · ✓; Whole Foods Market · Groceries · Jun 13 · $112.65 · ✓; City Power & Light · Utilities · Jun 11 · $98.40 · + Add receipt.

### 2. History
![History](screens/02-history.png)
**Purpose:** Browse/scroll all expenses, grouped by date, with missing receipts flagged.

**Layout:**
1. **Header** (`64px 22px 12px`): `History` (30/800) + `Robert's Care Account` (15/600 muted).
2. **Filter pills row** (gap 10): `All` (active = primary fill, white text), `This month`, `Needs receipt` (warning text) — pills radius 999, padding `11px 18px`, 15/700, inactive = white + `1px #D9E2F1` border.
3. **Scroll area:**
   - **Summary strip** (`#EEF3FB`, radius 16, padding `14px 18px`): `June 2026 · 14 expenses` ↔ `$1,847.20` (18/800).
   - **Date groups:** uppercase group label (`Today`, `Earlier this week`) then a white card (radius 20) of rows. Rows = 46px tile + [merchant 18/700, `category · date · ✓ Receipt` 14/600] + amount 18/800. **Flagged row** (City Power & Light): `category · date · Needs receipt` in warning color, row bg `#FFFBF2`.
4. **Bottom tab bar:** History active.

### 3. Scan receipt (camera)
![Scan receipt](screens/03-scan-receipt.png)
**Purpose:** Photograph a receipt in one tap; minimal chrome, reassuring guidance.

**Layout (dark screen, bg `#0E1726`, white text):**
1. **Top bar** (`62px 22px 10px`): `Cancel` (left) · `Scan receipt` (center 18/800) · `Flash` (right, dimmed).
2. **Hint chip:** full-width, `rgba(255,255,255,0.12)` bg, radius 14, centered `Hold steady — we'll snap it for you` (16/600).
3. **Viewfinder** (flex-fill, centered): a 236×330 "receipt" placeholder (light `#F4F1EA` card with gray text bars) framed by **four white corner brackets** (4px borders, ~30px, offset −7px outside the frame, rounded outer corner).
4. **Caption:** `Line the receipt up inside the corners` (15/600, dimmed).
5. **Controls row** (`4px 26px 40px`): left 58px rounded square `Photos`; center **shutter** = 84px white circle with `0 0 0 6px rgba(255,255,255,0.25)` ring and an inner 70px white circle with 3px dark border; right 58px rounded square `Type it` (manual entry).

> Implementation: wire the shutter to the platform camera; auto-capture when the receipt is detected in-frame. After capture, attach the photo to the expense being created.

### 4. Court report
![Court report](screens/04-court-report.png)
**Purpose:** Produce a filing-ready accounting for a reporting period — summary + category breakdown + export.

**Layout:**
1. **Header** (`64px 22px 8px`): `Court report` (30/800) + `Ready to file with the court` (15/600 muted).
2. **Scroll area** (gap 14):
   - **Period card** (white, radius 20, padding `18px 20px`, row): left = `Reporting period` (14/600) over `Jan 1 – Jun 30, 2026` (19/800); right = `Change` (15/700 primary).
   - **Account summary card** (white, radius 20, padding 20): heading `Account summary` (17/800); rows w/ dividers — `Opening balance` `$25,440.55`, `Total spent` `$12,960.00`, then **`Closing balance` `$12,480.55`** (17/800 label, 18/800 **positive-green** amount).
   - **Breakdown card** "Where the money went" (17/800): one row per category = [36px tile, name 16/700, amount 16/800] with a **proportion bar** below each (8px tall, track `#ECF1F8`, fill = category color, width = % of total). Values: Medical & Care `$4,210` (32%), Care Services `$3,840` (30%), Housing `$2,600` (20%), Groceries `$1,180` (9%).
   - **Create PDF report** — filled primary button, height 68, radius 18.
   - **Email to my attorney** — white outline button, height 60.
   - **Footnote:** `Every expense includes its receipt and date.` (14/600 disabled, centered).
3. **Bottom tab bar:** Reports active.

---

## Interactions & Behavior
- **Tab bar:** persistent bottom nav, 4 destinations (Home, History, Receipts, Reports). Active tab uses `brand/primary` for icon + label; others `#8A98AC`.
- **Add expense:** opens an expense-entry flow (not in this prototype — see "Gaps" below). Aim for the fewest fields: amount, category, merchant, optional receipt, date (default today).
- **Scan receipt:** opens the camera screen (#3). On capture, return to/continue the expense entry with the photo attached and (ideally) date + amount pre-filled via OCR.
- **Missing-receipt flag:** any expense without a receipt shows the warning chip/row tint; the `Needs receipt` filter scopes the History list to these.
- **Change period (report):** opens a period picker; regenerates summary + breakdown.
- **Create PDF / Email:** generates the accounting document for the selected period including every expense + attached receipts.
- **Buttons:** add a subtle pressed state (≈4% darken or 0.96 scale). Hit targets ≥56px.

## State Management
- **Account:** id, name (`Robert's Care Account`), current balance.
- **Expenses:** `{ id, merchant, category, amountCents, date, receiptImage|null }`. Derived: `spentThisMonth`, grouped-by-date lists, `needsReceipt` filter.
- **Reporting period:** `{ start, end }`; derived summary (`opening`, `totalSpent`, `income`, `closing`) and per-category totals + percentages.
- **Camera:** capture state; OCR-extracted `{ date, amount }` to pre-fill entry.

## Gaps (not in this prototype — design as needed)
- **Add-expense entry form**, **single-expense detail view**, **Receipts gallery** (the Receipts tab), **Settings**, period picker, and any auth/onboarding. Build these to match the tokens and patterns above.

## Assets
- No bitmap assets. Category "icons" are letter tiles; nav icons are inline SVG line icons (specs above). Use your platform's icon library if preferred.
- Font: **Public Sans** (Google Fonts / open source).

## Files
- `Guardianship Tracker.dc.html` — the HTML prototype containing **both** directions; implement **Direction A** (the first/top section, "Calm & Rounded"). Open in a browser to view.
- `ios-frame.jsx` — generic iOS device frame used only for phone preview; **not part of the design** to implement.
