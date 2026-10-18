# AGENTS.md — AI Agent Guidelines for KATA SCORER

## 1. Project Overview
- **Application**: KATA SCORER is an unofficial, zero-dependency, single-page web application designed for karate kata competition judges (includes disclaimer: "Not officially endorsed by the World Karate Federation (WKF)").
- **Scoring System**: Implements the World Karate Federation (WKF) kata scoring rules:
  - Valid score range: 5.0 to 10.0 in 0.1 increments (`SCORE_MIN = 5.0`, `SCORE_MAX = 10.0`, `SCORE_STEP = 0.1`).
  - Disqualification (DQ) assigns an explicit score of 0.0 (`SCORE_DQ = 0.0`).
- **Competitors**: Two competitor sides — AKA (Red) and AO (Blue).
- **Core Screens & Navigation Flow**:
  - `Home Screen` (`#screen-home`): Initial entry screen with buttons to start scoring either AKA (`#btn-home-aka`) or AO (`#btn-home-ao`).
  - `Select Screen` (`#screen-select`): 
    - Adjust score via touch snap-scroll list (`#score-scroll`), `+` (`#btn-plus`), and `−` (`#btn-minus`) buttons.
    - Large score preview display (`#current-score-display`).
    - Actions: "SHOW SCORE" (`#btn-show`) opens `#screen-display`; "DISQUALIFIED (0.0)" (`#btn-dq`) opens confirmation dialog.
    - Competitor navigation: If scoring AKA, shows "NEXT: AO →" (`#btn-sel-next`). If scoring AO, shows "← BACK TO AKA" (`#btn-sel-back`). There is no direct button back to Home.
  - `Display Screen` (`#screen-display`): 
    - High-visibility score presentation for the arena using a 5-row CSS Grid layout (`label`, `dq`, `score`, `actions`, `nav`) with background tint classes (`.tint-aka`, `.tint-ao`, `.tint-dq`).
    - Actions: "CHANGE SCORE" (`#btn-change`) returns to `#screen-select` (pre-filling previous score, or 5.0 if DQ); "FULL SCREEN" (`#btn-fullscreen`) toggles fullscreen.
    - Navigation: AKA display shows "NEXT: AO →" (`#btn-disp-next-ao`). AO display shows "← BACK TO AKA" (`#btn-disp-back`) and "NEXT ROUND ↻" (`#btn-disp-next-round`).
  - `Confirmation Dialog` (`#dialog-overlay`): Modal promise-based dialog protecting two destructive actions:
    1. Disqualification confirmation (`#btn-dq`): Prompts "Disqualify [AKA/AO]?\nThis will display 0.0."
    2. Next Round reset (`#btn-disp-next-round`): Prompts "Start a new round?\nAll current scores will be cleared." Only confirming Next Round resets state and navigates back to `#screen-home`.
  - `Orientation Toast` (`#orient-toast`): Floating alert prompting layout adjustments (`initial-portrait`, `to-portrait`, `to-landscape`), auto-dismissing in 6 seconds or toggling `.portrait-mode` on `<body>`.

## 2. Technology Stack
- **Architecture**: Self-contained, single-file HTML application (`index.html`). Operates directly over `file://` protocol with zero network calls.
- **HTML5**: Semantic tags, ARIA roles (`role="main"`, `role="listbox"`, `role="option"`, `role="dialog"`, `role="status"`), and ARIA live regions (`aria-live="polite"`, `aria-live="assertive"`).
- **CSS3**: Pure Vanilla CSS in `<style>`. 
  - CSS custom properties (`--bg`, `--surface`, `--surface-2`, `--border`, `--aka`, `--aka-dim`, `--aka-bg`, `--ao`, `--ao-dim`, `--ao-bg`, `--text`, `--text-muted`, `--text-dim`, `--dq`, `--dq-dim`, `--btn-h`, `--gap`, `--radius`).
  - Layouts: CSS Grid (named grid template areas in `#screen-display`), Flexbox, CSS Scroll Snap (`scroll-snap-type: y mandatory`, `scroll-snap-align: center`).
  - Sizing & Viewport: Fluid values with `clamp()` and `min()`, mobile safe-area insets (`env(safe-area-inset-*)`).
  - Responsive modes: Landscape default, `.portrait-mode` class layout overrides, and max-height 500px short-landscape queries.
- **JavaScript**: Pure Vanilla ES6+ in strict mode (`'use strict'`), zero dependencies, zero build steps.
- **Browser APIs**:
  - `Fullscreen API`: Prefixed fallback support (`requestFullscreen` / `webkitRequestFullscreen`), toggled via `#btn-fullscreen`.
  - `Screen Orientation API`: `window.screen.orientation` type inspection and `.lock()` / `.unlock()`; falls back to `matchMedia('(orientation: portrait)')` and `orientationchange`.
  - `Screen Wake Lock API`: `navigator.wakeLock.request('screen')` with automatic re-acquisition on `visibilitychange`.

## 3. Coding Guidelines
- **Maintain Single-File Architecture**: All markup, CSS, and JS must stay inside `index.html`. Do not split into external files.
- **Zero External Dependencies**: Never add npm/yarn packages, external stylesheets, CDNs, or runtime dependencies.
- **State Management**:
  - Centralized global `state` object:
    ```javascript
    const state = {
      competitor: COMPETITORS.AKA, // 'AKA' | 'AO'
      selScore: SCORE_MIN,         // number (5.0 to 10.0)
      displayedScore: { AKA: null, AO: null }, // number | null
      displayedDQ:    { AKA: false, AO: false }, // boolean
    };
    ```
- **DOM Access & Dynamic Elements**:
  - Helper `$` wraps `document.getElementById`.
  - Screens map: `screens = { home, select, display }`.
  - DOM elements cache: `els` cache object. Note: Home buttons (`#btn-home-aka`, `#btn-home-ao`) are referenced directly with `$()`.
  - The score items (`.score-item`) in `#score-scroll` are generated dynamically at runtime via `buildScrollList()`.
- **Keyboard Handling & Accessibility**:
  - Keyboard events are bound to `document` and strictly scoped:
    - When `#dialog-overlay` is active: `Enter` confirms (`closeDialog(true)`), `Escape` cancels (`closeDialog(false)`).
    - When `#screen-select` is active: `ArrowUp` triggers decrease (`#btn-minus`), `ArrowDown` triggers increase (`#btn-plus`), `Enter` triggers show (`#btn-show`).
    - No keyboard shortcuts are attached to `#screen-home` or `#screen-display`.
  - Preserve all `aria-*` attributes and live region announcements during any DOM manipulation.
- **Touch & Viewport Conventions**:
  - Touch targets must adhere to `--btn-h` (`clamp(48px, 7vh, 68px)`).
  - Score displays must use monospace system font stack (`'Courier New', Courier, monospace`).
  - UI text uses `'Segoe UI', system-ui, -apple-system, sans-serif`.

## 4. Testing Requirements
- **No Automated Test Runner**: There is no Jest/Vitest or browser automation runner. Validation is performed manually in standard desktop/mobile browsers.
- **Verification Checklist**:
  1. **Scoring Workflow**:
     - Click AKA &rarr; Select screen opens with red header.
     - Click `+` / `−` buttons or scroll picker &rarr; Verify `#current-score-display` updates (5.0–10.0 range).
     - Click "SHOW SCORE" &rarr; Display screen renders red tint, competitor name, and large score.
     - Click "NEXT: AO" &rarr; Select screen opens for AO with blue header.
     - Pick score &rarr; Click "SHOW SCORE" &rarr; Verify blue tint and score.
     - Click "← BACK TO AKA" &rarr; Navigates back to AKA Display screen showing AKA's score.
     - Click "CHANGE SCORE" &rarr; Select screen reopens with the previously selected score pre-selected.
     - Click "NEXT ROUND ↻" on AO display &rarr; Modal appears &rarr; Confirm &rarr; Scores clear and app returns to `#screen-home`.
  2. **Disqualification (DQ) Flow**:
     - On Select screen, click "DISQUALIFIED (0.0)".
     - Confirm dialog modal appears; clicking Cancel aborts; clicking Confirm displays `0.0`, amber DQ banner, and dark amber background (`.tint-dq`).
     - Clicking "CHANGE SCORE" after DQ resets picker to default 5.0 (since 0.0 is not in the scrollable 5.0–10.0 list).
  3. **Dialog Safeguards**:
     - Clicking backdrop overlay or pressing `Escape` cancels dialog.
     - Pressing `Enter` confirms dialog.
  4. **Orientation & Layout Responsiveness**:
     - Landscape: Default layout, score fills ~35–45% viewport height (`min(40vh, 28vw, 20rem)`).
     - Short landscape (height &le; 500px): Verify compact padding and scaled-down score font (`min(38vh, 26vw, 16rem)`).
     - Portrait: Verify `#orient-toast` appears with option to switch to portrait; accepting applies `.portrait-mode` to `<body>` with vertical stack.
     - Small viewport (width &le; 360px): Verify dialog buttons stack vertically and score adjusts properly.
  5. **Browser API Graceful Degradation**:
     - Verify full functionality even if Fullscreen, Screen Orientation lock, or Wake Lock APIs reject or are unsupported.

## 5. Important Constraints
- **Preserve Existing Functionality**: Maintain exact scoring mechanics (5.0–10.0 in 0.1 increments, DQ 0.0, modal safeguards).
- **Strict Single-File Boundary**: Keep everything self-contained within [index.html](file:///c:/Users/surya/OneDrive/Desktop/scorer/index.html). Never add extra `.js`, `.css`, or image files.
- **No External Dependencies**: Do not introduce npm packages, build pipelines, CSS frameworks, or external font/icon CDNs.
- **Offline & Protocol Compatibility**: Must run offline without internet access, compatible with both local `file://` URLs and static web hosts.
