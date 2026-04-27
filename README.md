# cispn.in — Personal Bio Page

> A minimal, aesthetic personal bio page with live Discord presence, real-time Spotify lyrics, and dynamic video backgrounds.

![Preview]( "vid/preview.png")

---

## Features

### Discord Integration
- Live avatar, username, and online status pulled via [Lanyard](https://github.com/Phineas/lanyard)
- Real-time activity tracking — shows current game (e.g. Roblox) with artwork
- Status indicator (online / idle / dnd / offline) with color coding

### Spotify
- Detects currently playing track with album art
- Synced, scrolling lyrics via [lrclib.net](https://lrclib.net) — highlights the active line in real time
- Playback progress bar synced to Discord activity timestamps

### Video Backgrounds
- Cycles through multiple background videos
- Skip forward / backward with arrow keys or buttons
- Volume slider (hidden until hovered) + mute toggle

### UI & Polish
- Typewriter effect on the **CisPn** identity bar
- Animated "About" section that cycles through rotating one-liners
- View counter
- Local time display (IST)
- Smooth entry overlay — click to enter

---

## Stack

| Tool | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lanyard API | Discord presence |
| lrclib API | Synced lyrics |

---

## Project Structure

```
/
├── src/
│   ├── App.tsx        # Main component — all UI and logic
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── public/
│   └── vid/           # Background video files
├── index.html
├── vite.config.ts
└── package.json
```

---

## Running Locally

```bash
npm install
npm run dev
```

---

## Socials

**CisPn**

| Platform | Link |
|---|---|
| GitHub | [github.com/cispn](https://github.com/cispn) |
| Instagram | [instagram.com/cispn](https://instagram.com/cispn) |
| YouTube | [youtube.com/@cispn](https://youtube.com/@cispn) |
| Spotify | [open.spotify.com/user/cispn](https://open.spotify.com/user/cispn) |
| Roblox | [roblox.com/users/NekoNoYumee](https://www.roblox.com/users/profile?username=NekoNoYumee) |
