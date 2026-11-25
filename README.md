# FocusDot — Deep Flow Mode & Cosmic Study Timer ⚡

[![Live Production](https://img.shields.io/badge/Live_Site-focusdotflow.vercel.app-D2FF3A?style=for-the-badge&logo=vercel&logoColor=black)](https://focusdotflow.vercel.app)
[![Launch App](https://img.shields.io/badge/Launch_App-Deep_Flow_Mode-080A0F?style=for-the-badge&logo=googlechrome&logoColor=D2FF3A)](https://focusdotflow.vercel.app/app)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue?style=for-the-badge&logo=pwa&logoColor=white)](https://focusdotflow.vercel.app/app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **FocusDot** is a next-generation student productivity and deep work application pairing **real-time WebGL cosmic orbs**, **40Hz acoustic gamma sync**, **cognitive state tuning**, and **intelligent study block scheduling**.

---

## 🌐 Official Links

- **Official Product Landing Page:** [https://focusdotflow.vercel.app](https://focusdotflow.vercel.app)
- **Live FocusDot Web Application:** [https://focusdotflow.vercel.app/app](https://focusdotflow.vercel.app/app)
- **Interactive Video Showcase:** [https://focusdotflow.vercel.app/promo/showcase.html](https://focusdotflow.vercel.app/promo/showcase.html)

---

## ✨ Key Features

- **🌌 Interactive WebGL Cosmic Orbs**: Real-time GLSL fragment shaders simulating fluid plasma, deep space nebula, and hyper-focus vortex that react dynamically to your focus state.
- **🎧 40Hz Acoustic Gamma Sync**: Scientifically tuned binaural audio engine producing 40Hz acoustic brainwave entrainment paired with calming pink noise and ambient cosmic hums.
- **⏱️ Deep Flow Timer & Micro-Sprints**: Flexible Pomodoro and deep work timing modes (25m classic, 45m deep study, 90m ultradian cycles, or custom micro-sprints).
- **📝 Context-Preserved Task Queue**: Integrated task and checklist system keeping your study goals in view without cognitive overload.
- **📱 Installable Progressive Web App (PWA)**: Works 100% offline with local storage caching, home screen install on iOS/Android/macOS/Windows, and zero latency.
- **☁️ Supabase Cloud Sync**: Instant cross-device cloud persistence for study logs, streaks, and focus metrics with Google OAuth and anonymous guest modes.

---

## 🚀 Quick Start (Local Development)

To run FocusDot locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/manash9-ai/FocusDot.git
cd FocusDot

# 2. Start the local development server
node tools/server.js
# Or use Python
python -m http.server 3000

# 3. Open in your browser
# Product Landing Page:
http://localhost:3000/index.html
# FocusDot Application:
http://localhost:3000/app.html
```

---

## 📂 Project Architecture

```
FocusDot/
├── index.html            # Official Product Landing Page (Served at root /)
├── landing.html          # Standalone Mirror of Product Landing Page (/landing)
├── app.html              # Live Web Application (/app)
├── vercel.json           # Vercel deployment configuration & route rewrites
├── manifest.webmanifest  # Progressive Web App (PWA) manifest
├── sw.js                 # Service Worker for offline caching
├── assets/               # Icons, graphics, and shader assets
├── promo/                # Showcase player and promo assets
├── public/               # Static assets & 9:16 vertical reel exports
└── tools/                # Development servers and video build tools
```

---

## 🛠️ Deployment

This project is deployed to **Vercel** with continuous deployment from the `main` branch.
All static assets and routes are configured in `vercel.json` with root directory routing.

---

© 2026 FocusDot. All rights reserved. Deep Flow Mode.
