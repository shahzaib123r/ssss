# Levi MD — Full (Baileys Multi-Device Bot)

A clean rewrite WhatsApp bot with familiar UX: menu, sticker maker, TTS, YouTube search + audio/video download, basic group guard, owner tools — all with a simple plugin system.

> ⚠️ Use responsibly and respect WhatsApp Terms of Service and your local laws.

## Quick Start
1. Install **Node.js 18+** & **git**.
2. Copy `.env.example` to `.env` and fill values.
3. Install deps: `npm install`
4. Start: `npm run qr` then scan QR with your WhatsApp (Linked Devices).
5. Next start: `npm start`

## Commands
- `.menu` — show all commands
- `.ping` — latency
- `.react` — emoji react
- `.sticker` — reply with an image or send with caption `.sticker` to get a sticker
- `.tts en your text` — text-to-speech (mp3)
- `.ytsearch query` — search YouTube
- `.yta url` — download YouTube audio (mp3/m4a)
- `.ytv url` — download YouTube video (mp4)
- `.kick @user` — (admins only) remove user from group

## Notes
- FFMPEG is bundled via `ffmpeg-static`, used by `fluent-ffmpeg`.
- Sticker conversion uses `sharp` → webp.
- Owner-only commands check `OWNERS` list in `.env`.
- This is an original codebase (not a copy-paste), Apache-2.0 licensed.
