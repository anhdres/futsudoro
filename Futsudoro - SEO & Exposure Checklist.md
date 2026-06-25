# Futsudoro — SEO & Exposure Checklist

## Scope
- Goal: improve organic discoverability without losing indie charm.
- Priority: set-and-forget website + SEO first.

## Rocky does (no intervention required)
- [x] Audit current `<head>` tags (title, description, canonical, OG/Twitter).
- [x] Implement final metadata in `futsudoro/index.html`.
- [x] Add Open Graph image strategy (single stable preview image + fallback).
- [x] Add `robots.txt`.
- [x] Add `sitemap.xml`.
- [x] Add JSON-LD `SoftwareApplication` structured data.
- [x] Add `llms.txt`.
- [x] Add `llms-full.txt` with richer context + canonical links.
- [x] Add a small indexable page (`/about` or `/how-it-works`) with searchable copy:
  - train pomodoro timer
  - flow-friendly pomodoro
  - chronos vs kairos timer
- [ ] Add social share-safe copy blocks (short + long).
- [x] Verify no broken links and run final smoke test.

## Andrés does (hands-on / approvals)
- [ ] Approve final SEO copy tone (2-3 key paragraphs).
- [ ] Approve OG preview image style (train-focused vs minimal logo).
- [ ] Decide canonical public URL policy (`www` vs apex).
- [ ] Approve final app descriptor/tagline.
- [ ] Optional: provide 1-2 screenshots for richer previews.

## Joint decisions (quick async)
- [ ] Final one-liner positioning for metadata.
- [ ] Primary keyword order (what appears first in title/description).
- [ ] Public contact/feedback URL/email to expose.

## Suggested execution order
1. Metadata + canonical
2. robots + sitemap
3. JSON-LD
4. `llms.txt` + `llms-full.txt`
5. Indexable about/how-it-works page
6. Final QA + deploy

## Definition of done
- [ ] Search engines can crawl and understand the app.
- [ ] Link previews look intentional.
- [ ] AI tools can parse an explicit machine-readable summary.
- [ ] Website has indexable explanatory copy beyond UI-only text.
- [ ] No obvious regression in UI/UX.

## Share-safe copy blocks (draft by Rocky)

### 1) Ultra-short one-liners (social bios / replies)
- Futsudoro: a train-inspired focus timer for deep work.
- Focus station by station.
- Pomodoro, but with flow-friendly mode.
- Chronos when you need discipline, Kairos when you find flow.

### 2) Short post (X / Discord / WhatsApp status)
Built a small web app called **Futsudoro** 🚆

It’s a train-themed focus timer with two modes:
- **Chronos**: strict pomodoro rhythm
- **Kairos**: alarm at preset, but you decide when to move on

If classic pomodoro breaks your flow, this might feel better.
https://www.futsudoro.app/

### 3) Medium post (Indie Hackers / Reddit)
I made **Futsudoro**, a train-inspired pomodoro web app for deep work.

The key idea is simple:
- Most timers are great to start focus
- But sometimes they interrupt momentum right when flow begins

So Futsudoro has two time philosophies:
- **Chronos** (strict): automatic phase transitions
- **Kairos** (flow-friendly): alarm rings at target time, but transitions are manual

You move station by station through your work session.

If you like calm indie tools and ambient productivity UX, I’d love feedback:
https://www.futsudoro.app/

### 4) Show HN style intro
Show HN: Futsudoro — a train-inspired pomodoro timer with Chronos/Kairos modes

I built this because classic pomodoro helps me start, but sometimes hurts flow.
So I added two modes:
- Chronos: strict automatic transitions
- Kairos: alert at target, manual transition when ready

It’s a small web app, intentionally simple and tactile.
Would love feedback on usability and pacing.
https://www.futsudoro.app/

### 5) Product Hunt style tagline + blurb
**Tagline options**
- Train-inspired focus timer for deep work
- Pomodoro that respects your flow
- Station-by-station focus with Chronos & Kairos

**Short blurb**
Futsudoro is a railway-themed productivity timer. Use Chronos for strict focus cycles, or Kairos when you want alerts without breaking flow.

### 6) Reply templates (when people ask “what is this?”)
- It’s a web focus timer with train vibes. You can run strict pomodoro (Chronos) or flow mode (Kairos). https://www.futsudoro.app/
- Think “pomodoro as a local train”: each session is a trip between stations.
- If you hate being forced to stop at 25:00, Kairos mode might be your thing.

### 7) Soft CTA variants (non-cringe)
- Try one trip and tell me if you’re more Chronos or Kairos.
- Curious what mode feels better for your workflow.
- If you test it in real work, I’d love your notes.

### 8) Visual post prompts (for short clips)
- “Chronos vs Kairos in 12 seconds”
- “When focus starts flowing, don’t break it”
- “From station to station: one deep work trip”

### 9) Hashtag packs (minimal)
- #productivity #pomodoro #deepwork #indiehacker
- #buildinpublic #webapp #focus #uidesign

### 10) Guardrails (keep brand vibe)
- Avoid hustle-bro language (“10x”, “crush”, etc.)
- Keep tone calm, craft-first, human
- Show behavior and feel, not feature dumping
