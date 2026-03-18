<div align="center">
  <img src="assets/icons/games48.png" alt="Quick Tap Logo" width="48" height="48">
  
  # Quick Tap - Browser Extension
</div>

A fast-paced idle clicker game built as a browser extension for Chrome and Firefox. This was my first extension project, created as a learning experience for my portfolio.

## 🎮 About the Game

**Quick Tap** is a simple but addictive idle clicker game where you tap to earn points and buy upgrades. The game demonstrates core idle/clicker game mechanics:

- **Tap to earn**: Click the TAP button to gain 1 point per click
- **Auto-tap upgrades**: Spend points to buy automatic tapping (1 point per second)
- **Exponential pricing**: Each upgrade costs 1.5x more than the last
- **Persistent progress**: Your game state is saved using the WebExtension storage API

## 📋 Features

- 🖱️ Interactive clicking gameplay
- 💾 Persistent save system (WebExtension Storage API)
- 📊 Real-time statistics (Score, Points per second)
- 🎨 Retro arcade-style UI with animated elements
- ⚡ Automatic point generation with upgrades

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Build Tool**: esbuild
- **Browser API**: WebExtension Storage API (Manifest v3)
- **Styling**: CSS3
- **Code Quality**: ESLint, Prettier

## 📦 Project Structure

```
quick-tap-extension/
├── src/
│   ├── popup.ts       # Main game logic and event handlers
│   ├── storage.ts     # Cross-browser storage management (Chrome/Firefox)
│   └── dom.ts         # DOM utility functions
├── assets/
│   └── icons/         # Extension icons (16x16, 48x48, 128x128)
├── popup.html         # Game UI
├── style.css          # Visual styling
├── manifest.json      # Extension configuration (Chrome + Firefox)
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Chrome and/or Mozilla Firefox

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

5. Load the extension in Firefox:

- Open `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select the `manifest.json` file from this project

## 📝 Available Scripts

- `npm run build` - Build the TypeScript files for production
- `npm run build:package` - Build and generate distribution packages for both Chrome Web Store and AMO (Firefox)
- `npm run package:zip` - Generate separate ZIPs for Chrome Web Store and AMO with validated manifests
- `npm run watch` - Watch mode for development (rebuilds on file changes)
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 📦 Packaging for Distribution

### Generate Distribution Packages

To build and package the extension for submission to app stores:

```bash
npm run build:package
```

This command:

1. Compiles TypeScript
2. Validates manifest for both platforms
3. Generates two separate deployment packages:
   - `release/quick-tap-extension-v1.0.0-chrome.zip` - Chrome Web Store
   - `release/quick-tap-extension-v1.0.0-firefox.zip` - Mozilla Add-ons (AMO)

### Why Two Separate ZIPs?

- **Firefox (AMO)**: Includes `browser_specific_settings` with extension ID and minimum version requirements
- **Chrome Web Store**: Strips `browser_specific_settings` to avoid validation warnings
- **Shared code**: TypeScript, assets, and UI are identical in both packages

### Validation Process

The packager automatically validates:

**Common requirements** (both stores):

- Manifest v3 format
- Required fields: `name`, `version`, `description`
- Valid version format (e.g., `1.0.0`)
- Required icons (16x16, 48x48, 128x128)
- Storage permission included

**Firefox-specific** (AMO):

- `browser_specific_settings.firefox.id`
- `browser_specific_settings.firefox.strict_min_version`

**Chrome-specific** (Web Store):

- No Firefox-specific settings in final manifest

If validation fails, the packager displays store-specific error messages to help with debugging.

## 🧪 Testing the Extension

### Development Testing (Quick)

After `npm run build`, load the extension folder directly:

**Chrome:**

- Open `chrome://extensions/`
- Enable Developer mode
- Click "Load unpacked"
- Select the project folder

**Firefox:**

- Open `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select `manifest.json` from the project folder

### Testing Distribution Packages (Recommended before submission)

After `npm run build:package`, test the exact packages that will be submitted:

1. Extract the ZIP files:

   ```bash
   unzip release/quick-tap-extension-v1.0.0-firefox.zip -d /tmp/quick-tap-firefox
   unzip release/quick-tap-extension-v1.0.0-chrome.zip -d /tmp/quick-tap-chrome
   ```

2. Load each extension from the extracted folder:
   - Chrome: Load unpacked from `/tmp/quick-tap-chrome`
   - Firefox: Load Temporary Add-on from `/tmp/quick-tap-firefox/manifest.json`

### Test Checklist

- [ ] Popup opens without errors
- [ ] TAP button increments points
- [ ] Auto-tap purchase works and increases PPS (points per second)
- [ ] Price progression is correct (1.5x multiplier)
- [ ] Game state persists after closing and reopening popup
- [ ] Language toggle works (if implemented)
- [ ] Console shows no storage/API errors
- [ ] Extension works identically in both Firefox and Chrome

## 🎓 Learning Goals

This project was built to learn:

- Browser extension development (Manifest v3)
- TypeScript in a real project
- WebExtension Storage API for data persistence
- Event-driven JavaScript patterns
- Game state management
- Build tools (esbuild)
- Web development best practices

## 🌐 Cross-Browser Compatibility

This extension is built to work seamlessly on both Chrome and Firefox with a single codebase:

- **API Abstraction**: Uses dynamic API resolution (`getExtensionAPI()`) to support both `chrome.*` and `browser.*` namespaces
- **Manifest Support**: Dual manifest strategies for each store
  - Firefox manifest includes `browser_specific_settings` (required for AMO)
  - Chrome manifest is cleaned for Chrome Web Store validation
- **Storage API**: Uses unified WebExtension Storage API compatible with both browsers
- **Icons & Assets**: Platform-agnostic PNG icons and CSS styling

### Browser-Specific Differences

| Feature             | Chrome                                | Firefox                                    |
| ------------------- | ------------------------------------- | ------------------------------------------ |
| Loading method      | `chrome://extensions` (Load unpacked) | `about:debugging` (Load Temporary Add-on)  |
| Manifest format     | Standard MV3                          | MV3 with `browser_specific_settings`       |
| Storage API         | `chrome.storage.local`                | `browser.storage.local`                    |
| Session persistence | Persistent with extension             | Clears on browser restart (temporary mode) |

## 📦 Distribution

### Chrome Web Store Submission

1. Run `npm run build:package`
2. Upload `release/quick-tap-extension-v1.0.0-chrome.zip` to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
3. Follow Google's submission guidelines

### Firefox Add-ons (AMO) Submission

1. Run `npm run build:package`
2. The Firefox ZIP includes required metadata:
   - **ID**: `quick-tap-extension@carloseocandido.github.io`
   - **Min Version**: Firefox 109.0 (first MV3-compatible release)
3. Upload `release/quick-tap-extension-v1.0.0-firefox.zip` to [addons.mozilla.org](https://addons.mozilla.org)
4. Follow Mozilla's add-on submission process

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
await extensionAPI.storage.local.set(state);
```

### Cross-Browser API Abstraction

```typescript
function getExtensionAPI(): ExtensionStorageAPI {
  const api = globalThis.browser ?? globalThis.chrome;
  if (!api) throw new Error('Browser extension API not available');
  return api;
}
```

## 🔧 Development & Architecture

### Packaging Pipeline

The extension includes an automated packaging system (`scripts/package.ts`) that:

1. **Validates** manifest requirements for both platforms before packaging
2. **Creates** separate staging directories for Firefox and Chrome versions
3. **Generates** two distribution ZIPs with platform-specific manifests
4. **Validates** store-specific rules with clear error messages:
   - Firefox: Ensures `browser_specific_settings.firefox` is present and valid
   - Chrome: Ensures no Firefox-specific metadata in final manifest

### TypeScript Compilation

- **Build target**: ES2020 with ESNext modules
- **Bundle format**: IIFE (Immediately Invoked Function Expression) for browser compatibility
- **Source maps**: Not included in distribution to reduce package size

### Storage Implementation

The storage layer (`src/storage.ts`) provides type-safe state management:

- Supports both Chrome Storage API and WebExtension Storage API
- Automatic API detection at runtime
- Async/await for all storage operations
- Full TypeScript type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 About

Created by [Carlos Candido](https://github.com/carloseocandido) as a portfolio learning project.

---

**Note**: This is a minigame created purely for educational purposes. It serves as a foundation for understanding browser extension development and game mechanics implementation.
