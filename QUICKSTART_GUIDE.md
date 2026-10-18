# KATA SCORER — Quickstart Guide

A quick, beginner-friendly guide to scoring karate kata competitions using **KATA SCORER**.

---

## 1. Accessing the Application

KATA SCORER is a self-contained, single-page application that runs entirely inside any modern web browser (Google Chrome, Apple Safari, Microsoft Edge, Mozilla Firefox):

- **Hosted Web Version**: Open the deployed URL provided for your tournament in any desktop, tablet, or mobile browser.
- **Local File Version (Offline)**: If using the app locally, simply double-click `index.html` to open it directly via the `file://` protocol. It requires no local web server, build tools, or internet connection, and never sends network requests.

> **Display & Orientation Tip**: 
> - **Landscape mode** is the primary layout designed for competition judging and score displays. 
> - If launched in portrait orientation, an **Orientation Toast** prompt appears allowing you to switch to portrait layout or rotate your device (the toast auto-dismisses after 6 seconds).
> - On the Display Screen, judges can tap **⛶ FULL SCREEN** to expand the display edge-to-edge.

---

## 2. Selecting a Competitor (AKA or AO)

On the **Home Screen**, two large buttons allow you to choose which competitor to score:

- **AKA (Red)**: Tap to score the red competitor.
- **AO (Blue)**: Tap to score the blue competitor.

Selecting either opens the **Score Selection Screen**, dynamically tinted in that competitor's theme color (red for AKA, blue for AO).

---

## 3. Selecting and Displaying a Score

Scores follow the World Karate Federation (WKF) kata scoring range of **5.0 to 10.0** in **0.1 increments**.

### To choose a score:
1. **Adjust the value**:
   - Tap **`+`** to increase score by 0.1.
   - Tap **`−`** to decrease score by 0.1.
   - Or **scroll the number list** vertically; it will snap-center to the nearest 0.1 value.
   - *(Desktop keyboard)*: On the Selection Screen, press **`ArrowDown`** to increase score (moves down the list towards 10.0) or **`ArrowUp`** to decrease score (moves up the list towards 5.0).
2. **Preview**: Verify your score in the large real-time display beside the picker.
3. **Display the score**: Tap **SHOW SCORE** (or press **`Enter`** on desktop).

The **Display Screen** opens, presenting the competitor name and large score formatted for arena visibility against a tinted background (`.tint-aka` or `.tint-ao`).

---

## 4. Changing a Displayed Score

If a judge needs to revise a score before advancing:

1. On the **Display Screen**, tap **CHANGE SCORE**.
2. The Selection Screen reopens with that competitor's previously displayed score pre-selected.
3. Adjust the score using `+`, `−`, or the scroll picker.
4. Tap **SHOW SCORE** to update and present the new score.

*(Note: If the competitor was previously disqualified, tapping "CHANGE SCORE" defaults back to 5.0, since 0.0 is not in the scrollable 5.0–10.0 list).*

---

## 5. How Disqualification (DQ) Works

Under WKF rules, a disqualification assigns an explicit score of **0.0**:

1. On the **Score Selection Screen**, tap **DISQUALIFIED (0.0)**.
2. A modal confirmation dialog appears:
   > *"Disqualify [AKA/AO]? This will display 0.0."*
3. Tap **YES, DISQUALIFY** (or press **`Enter`** on desktop) to confirm. To cancel, tap **CANCEL** (or press **`Escape`**).
4. Upon confirmation, the Display Screen shows:
   - Score: **0.0**
   - High-visibility amber **DISQUALIFIED** banner
   - Dark amber tinted background

---

## 6. Switching Between Competitors

You do not need to return to the Home Screen to score the next competitor:

- **When scoring AKA**:
  - Tap **NEXT: AO →** from either the Selection Screen or Display Screen to proceed directly to scoring AO.
- **When scoring AO**:
  - Tap **← BACK TO AKA** from either the Selection Screen or Display Screen to return to AKA. If AKA has already been scored, this returns straight to AKA's Display Screen.

---

## 7. Starting a New Round

To prevent accidental score resets during an active bout, resetting is strictly protected:

1. Navigate to the **AO Display Screen**.
2. Tap **NEXT ROUND ↻**.
3. A confirmation modal prompt appears:
   > *"Start a new round? All current scores will be cleared."*
4. Tap **YES, START NEW ROUND** (or press **`Enter`** on desktop) to clear all stored scores for both competitors and return to the **Home Screen**.
5. Tap **CANCEL** (or press **`Escape`**) to abort.

---

## 8. Is Installation Required?

**No installation is required.**

- **Zero setup**: No app stores, terminal commands, or `npm` dependencies.
- **True offline operation**: Contains zero network requests, external fonts, or CDN dependencies. The app runs completely offline over local `file://` or any static host.
- **Screen Wake Lock**: Where supported (modern browsers such as Chrome, Edge, and Safari), the app automatically requests a Screen Wake Lock upon loading and re-acquires it whenever the app becomes visible, helping prevent device screens from sleeping during judging. If unsupported by the browser or restricted by security policy, the app degrades gracefully without interruption.
- **Scoped Keyboard Controls**: Desktop shortcuts are strictly active where needed—`ArrowUp`/`ArrowDown`/`Enter` on the Selection Screen, and `Enter`/`Escape` on confirmation dialogs. No keyboard shortcuts interfere with the Home or Display screens.
