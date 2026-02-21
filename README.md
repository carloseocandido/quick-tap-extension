<div align="center">
  <img src="assets/icons/games48.png" alt="Quick Tap Logo" width="48" height="48">
  
  # Quick Tap - Chrome Extension
</div>

A fast-paced idle clicker game built as a Chrome extension. This was my first extension project, created as a learning experience for my portfolio.

## 🎮 About the Game

**Quick Tap** is a simple but addictive idle clicker game where you tap to earn points and buy upgrades. The game demonstrates core idle/clicker game mechanics:

- **Tap to earn**: Click the TAP button to gain 1 point per click
- **Auto-tap upgrades**: Spend points to buy automatic tapping (1 point per second)
- **Exponential pricing**: Each upgrade costs 1.5x more than the last
- **Persistent progress**: Your game state is saved using Chrome storage API

## 📋 Features

- 🖱️ Interactive clicking gameplay
- 💾 Persistent save system (Chrome Storage API)
- 📊 Real-time statistics (Score, Points per second)
- 🎨 Retro arcade-style UI with animated elements
- ⚡ Automatic point generation with upgrades

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Build Tool**: esbuild
- **Browser API**: Chrome Storage API (Manifest v3)
- **Styling**: CSS3
- **Code Quality**: ESLint, Prettier

## 📦 Project Structure

```
quick-tap-extension/
├── src/
│   ├── popup.ts       # Main game logic and event handlers
│   ├── storage.ts     # Chrome storage management
│   └── dom.ts         # DOM utility functions
├── assets/
│   └── icons/         # Extension icons (16x16, 48x48, 128x128)
├── popup.html         # Game UI
├── style.css          # Visual styling
├── manifest.json      # Chrome extension configuration
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Chrome browser

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd quick-tap-extension
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select this project folder

## 📝 Available Scripts

- `npm run build` - Build the TypeScript files for production
- `npm run watch` - Watch mode for development (rebuilds on file changes)
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🎓 Learning Goals

This project was built to learn:

- Chrome Extension development (Manifest v3)
- TypeScript in a real project
- Chrome Storage API for data persistence
- Event-driven JavaScript patterns
- Game state management
- Build tools (esbuild)
- Web development best practices

## 💡 Game Mechanics

### Scoring System

- Each tap: **+1 point**
- Auto-tap upgrade: **+1 point/second**
- Upgrade cost formula: `price * 1.5`

### Example Progression

```
Initial auto price: 50 points
After 1st upgrade: 75 points
After 2nd upgrade: 112 points
After 3rd upgrade: 168 points
...and so on
```

## 🎨 Code Highlights

### Type-Safe DOM Manipulation

```typescript
const pointsEl = mustGetById<HTMLDivElement>('points');
```

### Game State Management

```typescript
type GameState = {
  points: number;
  pps: number; // points per second
  autoPrice: number;
};
```

### Persistent Storage

```typescript
await chrome.storage.local.set(state);
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 About

Created by [Carlos Candido](https://github.com/carloseocandido) as a portfolio learning project.

---

**Note**: This is a minigame created purely for educational purposes. It serves as a foundation for understanding Chrome extension development and game mechanics implementation.
