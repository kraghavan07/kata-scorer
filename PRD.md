# KATA SCORER — Product Requirements Document (PRD)

**Document Version:** 1.0  
**Status:** Current Implementation & Future Roadmap  
**Scope:** Single-Page Karate Kata Scoring Tool  
**Disclaimer:** Unofficial tool; not officially endorsed by the World Karate Federation (WKF).  

---

## 1. Problem Statement

In karate kata competitions, judges stationed around the tatami (competition mat) need to enter scores quickly and display them clearly to table officials and scorers seated several meters away.

Traditional scoring methods often rely on physical flip-cards, paper scorecards, or expensive dedicated hardware. When judges use standard mobile devices, they face common problems:
- Complex apps that require account registration, downloads, or internet connectivity (which is often unreliable in sports halls).
- Small typography that table officials cannot read at a distance.
- Accidental taps that wipe scores mid-match.
- Phone screens that dim or turn off while judging.

**KATA SCORER** solves this by providing an unofficial, lightweight, zero-installation, single-file web application that runs directly in any modern browser (online or 100% offline). It allows judges to select scores with ergonomic touch controls and display them in high-visibility arena typography, protected by strict error-prevention safeguards.

---

## 2. Target Users & Personas

### Primary Users: Karate Kata Judges
- **Role**: Competition judges positioned around the ring evaluating kata performances.
- **Key Needs**:
  - Fast, intuitive score input under World Karate Federation (WKF) rules (5.0 to 10.0 in 0.1 increments).
  - Ability to operate the app comfortably on personal smartphones or tablets (especially in landscape orientation).
  - Safety guards that prevent accidental score loss or accidental disqualifications.
  - Ability to quickly adjust or correct a score before it is finalized.

### Secondary Users: Table Officials, Scorers, & Audience
- **Role**: Table recorders, scorekeepers, and tournament officials noting down judges' scores.
- **Key Needs**:
  - Instant visual recognition of competitor sides: **AKA** (Red) vs. **AO** (Blue).
  - Massive, high-contrast score displays readable from across the competition area.
  - Clear, unmistakable visual indicators when a competitor is **Disqualified (0.0)**.

---

## 3. Functional Requirements (Current Implementation)

The following requirements reflect the verified, active features of the current application (`index.html`):

### FR-1: Zero-Installation & Browser Compatibility
- The application must function out-of-the-box as a self-contained single file (`index.html`) in all standard modern browsers (Chrome, Edge, Safari, Firefox).
- The application must run without requiring a local web server, app store installation, build tools, or network connection (accessible via `file://` protocol).

### FR-2: Competitor Selection (Home Screen)
- The initial **Home Screen** (`#screen-home`) must present two primary competitor options:
  - **AKA Button** (`#btn-home-aka`): Enters scoring mode for the red competitor.
  - **AO Button** (`#btn-home-ao`): Enters scoring mode for the blue competitor.
- Selecting a competitor must dynamically theme subsequent screens with that competitor's signature color (Red for AKA, Blue for AO).

### FR-3: WKF Score Selection (Select Screen)
- The **Selection Screen** (`#screen-select`) must support the official WKF score range of **5.0 to 10.0** in **0.1 increments** (51 discrete score choices).
- Scoring input must support three simultaneous input methods:
  1. **Step Buttons**: `+` (`#btn-plus`) to increase score by 0.1; `−` (`#btn-minus`) to decrease score by 0.1.
  2. **Touch/Mouse Snap-Scroll Picker** (`#score-scroll`): A vertical scrolling list that automatically snaps to center the selected 0.1 value.
  3. **Desktop Keyboard Controls**: `ArrowDown` to increment score; `ArrowUp` to decrement score.
- The screen must provide a large, real-time preview display (`#current-score-display`) reflecting the selected score.
- Tapping **SHOW SCORE** (`#btn-show`) or pressing `Enter` must transition to the Display Screen.

### FR-4: Arena Score Presentation (Display Screen)
- The **Display Screen** (`#screen-display`) must use a 5-row CSS grid layout to present:
  - Competitor label (`#disp-label`): "AKA" or "AO" in large uppercase text.
  - Score display (`#disp-score`): Giant monospace font sized to fill approximately 35–45% of viewport height in landscape mode.
  - Contextual background tints (`.tint-aka` or `.tint-ao`).
- The display screen must include a **FULL SCREEN** button (`#btn-fullscreen`) that toggles edge-to-edge browser presentation using the Fullscreen API.

### FR-5: Score Revision
- From the Display Screen, judges must be able to tap **CHANGE SCORE** (`#btn-change`) to return to the Selection Screen.
- Reopening the Selection Screen must pre-select the competitor's previously displayed score (or default to 5.0 if the competitor was previously disqualified).

### FR-6: Competitor Navigation Flow
- Judges must be able to transition smoothly between competitors without returning to the Home Screen:
  - While scoring AKA: Displays a "NEXT: AO →" button (`#btn-sel-next`, `#btn-disp-next-ao`).
  - While scoring AO: Displays a "← BACK TO AKA" button (`#btn-sel-back`, `#btn-disp-back`). If AKA was already scored, tapping back must open AKA's Display Screen; if unscored, it opens AKA's Selection Screen.

### FR-7: Disqualification (DQ) Flow
- The Selection Screen must provide a dedicated **DISQUALIFIED (0.0)** button (`#btn-dq`).
- Tapping the button must prompt a confirmation dialog to prevent accidental disqualifications.
- Upon confirmation, the Display Screen must present:
  - Score value: **0.0**
  - Prominent amber banner: **DISQUALIFIED** (`#disp-dq-text`)
  - Dark amber background tint (`.tint-dq`)

### FR-8: New Round Reset
- Once AO's score is displayed, the judge must have access to a **NEXT ROUND ↻** button (`#btn-disp-next-round`).
- Tapping "NEXT ROUND ↻" must trigger a confirmation dialog warning that all scores will be cleared.
- Upon confirmation, all in-memory scores must reset to initial values (`null` scores, `false` DQ flags), and the application must return to the **Home Screen** ready for the next match.

### FR-9: Responsive Layout & Orientation Handling
- The layout must default to **Landscape orientation**, optimized for tablets and horizontally held phones.
- An **Orientation Toast** (`#orient-toast`) must appear when:
  - The app is opened in portrait orientation (`initial-portrait`).
  - The device is rotated from landscape to portrait (`to-portrait`).
  - The device is rotated from portrait to landscape (`to-landscape`).
- The toast must auto-dismiss after 6 seconds or upon manual dismissal.
- Accepting the toast prompt must toggle the `.portrait-mode` CSS class on `<body>` to stack buttons vertically and resize scores appropriately.

### FR-10: Display Sleep Prevention (Screen Wake Lock)
- The application must automatically request a **Screen Wake Lock** upon load and re-acquire it when the browser tab becomes visible, preventing judge screens from dimming or sleeping mid-match.
- If the browser does not support Wake Lock or blocks it (such as non-secure contexts), the application must degrade gracefully without error.

---

## 4. Error Prevention Safeguards

Because competition judging happens in high-pressure environments, the application incorporates strict error-prevention mechanisms:

| Potential Error | Built-in Safeguard |
| :--- | :--- |
| **Accidental Disqualification** | Clicking "DISQUALIFIED (0.0)" opens a modal dialog (`#dialog-overlay`). The judge must explicitly confirm by clicking "YES, DISQUALIFY" or pressing `Enter`. Tapping "CANCEL", pressing `Escape`, or tapping the backdrop aborts the action. |
| **Accidental Score Reset Mid-Bout** | The Home Screen cannot be accessed directly from the Selection Screen or AKA Display Screen. The only way to clear scores is via "NEXT ROUND ↻" on the AO Display Screen, which is guarded by a confirmation dialog. |
| **Mistyped or Incorrect Score** | Judges can tap "CHANGE SCORE" at any time from the Display Screen to reload and edit the competitor's score before concluding the round. |
| **Accidental Page Scrolling via Keyboard** | On the desktop Selection Screen, pressing `ArrowUp` or `ArrowDown` calls `e.preventDefault()` to stop the browser window from jumping or scrolling while adjusting the score. |
| **Out-of-Bounds Scores** | The scroll picker and step buttons strictly enforce the WKF boundary (minimum 5.0, maximum 10.0, step 0.1). Arbitrary or invalid scores cannot be selected. |

---

## 5. Acceptance Criteria & Verification

> **Note**: The checklist below outlines the manual verification criteria required before deploying or distributing a release of KATA SCORER. Because the project is a zero-dependency client-side script with no automated test harness, all checks must be validated manually in a standard browser. These checkboxes represent criteria to be evaluated, not an assertion that past automated tests have passed.

### Scoring & Flow
- [ ] Clicking **AKA** from the Home screen opens the Selection screen with red styling.
- [ ] Scores can be adjusted from 5.0 to 10.0 using `+`, `−`, scroll snapping, and arrow keys.
- [ ] Clicking **SHOW SCORE** opens the Display screen showing the correct competitor name, score, and colored tint.
- [ ] Clicking **CHANGE SCORE** returns to the Selection screen with the previously chosen score pre-selected.
- [ ] Clicking **NEXT: AO →** transitions to scoring the blue competitor.
- [ ] Scoring AO and clicking **← BACK TO AKA** returns to AKA's Display screen with AKA's score intact.

### Dialog Confirmations
- [ ] Disqualification requires explicit confirmation in the dialog; cancelling keeps the current score.
- [ ] Disqualification renders `0.0`, amber text, and amber background tint.
- [ ] Clicking "CHANGE SCORE" after disqualification resets the picker to baseline 5.0.
- [ ] Clicking **NEXT ROUND ↻** triggers a confirmation modal; confirming clears all scores and returns to the Home screen.
- [ ] Pressing `Enter` confirms active dialogs; clicking `CANCEL`, pressing `Escape`, or clicking the backdrop overlay cancels.

### Responsiveness & Environment
- [ ] The app renders correctly on desktop computers, tablets, and smartphones.
- [ ] Tapping **FULL SCREEN** toggles fullscreen mode (where supported by the browser).
- [ ] The display screen is legible from at least 3–5 meters away in landscape mode.
- [ ] Short landscape screens (height &le; 500px) scale score font size without vertical overflow or clipping.
- [ ] Rotating to portrait triggers the orientation toast; accepting reconfigures the UI to vertical stacking.
- [ ] The app works offline with zero network connectivity when opened via `file://`.
- [ ] Screen Wake Lock is requested on load where supported, degrading gracefully without throwing unhandled exceptions if unsupported.
- [ ] Browser developer console contains zero JavaScript errors or unhandled promise rejections.

---

## 6. Future Improvements (Roadmap & Proposed Features)

> **Important**: The features listed below are proposed ideas for future iterations. They are **not** present in the current codebase and must not be treated as existing functionality.

### P-1: Tournament & Match Metadata
- Allow judges or table officials to display match/bout identifiers (e.g., "Bout #14", "Pool A", "Male Senior Kata Final").
- Add an optional field to input or display competitor names alongside AKA/AO.

### P-2: Multi-Judge Wireless Tabulation
- Connect multiple judging devices (e.g., 5 or 7 judges) wirelessly to a central table scoring system using WebSockets or WebRTC.
- Automatically discard highest and lowest scores and calculate the official final score according to WKF rules.

### P-3: Progressive Web App (PWA) Support
- Add a Web App Manifest (`manifest.json`) and Service Worker to allow judges to tap "Add to Home Screen" on iOS/Android for a native full-screen app icon.
- Provide custom offline asset caching.

### P-4: Haptic & Audio Feedback
- Provide subtle haptic vibration (via the Vibration API) when tapping buttons or snapping score items on mobile devices.
- Optional audible tone when a score is shown or when a round is completed.

### P-5: Kumite Scoring Mode
- A separate scoring tab or toggle for Kumite (sparring) competitions, supporting point values (Ippon = 3, Waza-ari = 2, Yuko = 1), match timers, and penalty categories (Chukoku, Keikoku, Hansoku-chui, Hansoku).

### P-6: Custom Scoring Ranges & Rule Sets
- Configuration settings to support alternative scoring ranges (e.g., traditional 6.0–8.0 scales, youth categories, or custom tournament rules).
