# 🎲 Kids TV Time Dice Roller

A playful, interactive, 3D animated dice rolling web application designed to help parents and kids decide screen time & TV allowances in a fun, fair, and engaging way!

🚀 **Live on GitHub Pages**: Pure client-side HTML5, CSS3, and Vanilla JavaScript with LocalStorage persistence.

---

## ✨ Key Features

- 🎲 **Interactive 3D Physics Dice**:
  - Realistic 3D cube rotations with dynamic velocity, bouncing settling, and lighting effects.
  - Multiple roll triggers: Click button, Tap/Swipe anywhere in 3D viewport, Shake mobile device, or press Spacebar.
- 📺 **Default TV Time Configuration**:
  - **1**: ⚡ 2 Minutes (Quick Sneak Peek)
  - **2**: 🍿 5 Minutes (Short Cartoon Clip)
  - **3**: 🎬 10 Minutes (Mini Episode)
  - **4**: 🚀 20 Minutes (Full TV Show)
  - **5**: 🌟 30 Minutes (Double Feature)
  - **6**: 👑 1 Hour (MEGA Movie Time!)
- 🎨 **Fully Customizable Faces**:
  - Parents can customize all 6 faces: Labels, Duration (minutes), Emojis, Activity Subtext, and Theme Colors.
  - Reset to default standard TV times with 1 click.
- 🎯 **Theme Presets & Custom Presets**:
  - Built-in presets for TV Time, Bedtime Stories, Outdoor Play, and Video Games.
  - Save custom customizer presets to `localStorage` and switch anytime!
- ⏱️ **Interactive TV Screen Time Countdown Timer**:
  - 1-click launch from the winning dice roll.
  - Circular animated progress ring with time warnings (Green ➔ Yellow ➔ Red).
  - Sound alarm chime and voice alert when time is up.
  - Quick adjust buttons (`+1m`, `-1m`, `+5m`).
- 🔊 **Synthesized Sound FX & Voice Announcer**:
  - Built using Web Audio API (zero external audio files needed; 100% offline & fast).
  - Dice rattle, table bounce thud, victory celebration fanfare, timer chime, and Web Speech voice narrator.
- 🔒 **Parent Mode / Kid Lock Security**:
  - Simple math puzzle verification to protect settings from accidental edits by young children.
- 📜 **Roll History Log**:
  - View previous rolls with timestamps and durations.
- 📱 **Mobile & Tablet Optimized**:
  - Responsive glassmorphism UI designed for phones, iPads, tablets, and desktop displays.

---

## 🚀 How to Host on GitHub Pages (`github.io`)

This project is built with standard pure HTML, CSS, and JavaScript, with no build tools or package managers required.

### Method 1: Automatic GitHub Actions (Included)
1. Push this repository to GitHub on the `main` or `master` branch.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy the app to `https://<username>.github.io/<repo-name>/`.

### Method 2: Deploy directly from Branch
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch: `main` (or `master`) and folder: `/ (root)`.
4. Click **Save**. Your site will be live in ~1 minute!

---

## 💻 Local Preview

You can run any local static file server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js npx serve
npx -y serve .
```

Open your browser at `http://localhost:8000`.

---

## 🛠️ Technology Stack
- **HTML5**: Semantic tags, accessibility (ARIA), responsive viewport.
- **Vanilla CSS3**: 3D transforms (`perspective`, `preserve-3d`, `rotateX/Y/Z`), Glassmorphism, CSS Custom Properties, Keyframe animations.
- **Vanilla JavaScript (ES6+)**:
  - `localStorage` API for instant state persistence.
  - `Web Audio API` for synthesized sound effects.
  - `Web Speech API` (`speechSynthesis`) for playful voice announcements.
  - `HTML5 Canvas API` for smooth 60fps confetti explosions.
  - `DeviceMotionEvent` for mobile shake-to-roll.

---

## 📄 License
MIT License. Created with ❤️ for happy kids and parents!
