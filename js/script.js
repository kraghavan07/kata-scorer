'use strict';
const SCORE_MIN = 5.0, SCORE_MAX = 10.0, SCORE_STEP = 0.1, SCORE_DQ = 0.0;
const COMPETITORS = { AKA: 'AKA', AO: 'AO' };
const SCORES = [];
for (let s = SCORE_MIN; s <= SCORE_MAX + 0.00001; s += SCORE_STEP) {
  SCORES.push(parseFloat(s.toFixed(1)));
}

const state = {
  competitor: COMPETITORS.AKA,
  selScore: SCORE_MIN,
  displayedScore: { AKA: null, AO: null },
  displayedDQ: { AKA: false, AO: false },
};

const $ = id => document.getElementById(id);
const screens = { home: $('screen-home'), select: $('screen-select'), display: $('screen-display') };
const els = {
  selTitle: $('sel-title'),
  scoreScroll: $('score-scroll'),
  currentScoreDsp: $('current-score-display'),
  btnMinus: $('btn-minus'), btnPlus: $('btn-plus'),
  btnShow: $('btn-show'), btnDQ: $('btn-dq'),
  btnSelBack: $('btn-sel-back'), btnSelNext: $('btn-sel-next'),
  dispLabel: $('disp-label'), dispDQText: $('disp-dq-text'), dispScore: $('disp-score'),
  btnChange: $('btn-change'), btnFullscreen: $('btn-fullscreen'),
  btnDispBack: $('btn-disp-back'), btnDispNextAO: $('btn-disp-next-ao'), btnDispNextRound: $('btn-disp-next-round'),
  dialogOverlay: $('dialog-overlay'), dialogTitle: $('dialog-title-text'),
  dialogConfirm: $('dialog-confirm'), dialogCancel: $('dialog-cancel'),
  orientToast: $('orient-toast'),
  orientToastMsg: $('orient-toast-msg'),
  orientToastAccept: $('orient-toast-accept'),
  orientToastDismiss: $('orient-toast-dismiss'),
};

/* ---- Screen Management ---- */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

/* ---- Score Scroll ---- */
let scrollItems = [];
let scrollTimer = null;

function buildScrollList() {
  const container = els.scoreScroll;
  container.innerHTML = '';
  scrollItems = [];
  SCORES.forEach((score, idx) => {
    const item = document.createElement('div');
    item.className = 'score-item';
    item.dataset.score = score;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    item.textContent = score.toFixed(1);
    item.addEventListener('click', () => selectByIndex(idx));
    container.appendChild(item);
    scrollItems.push(item);
  });
  applyScrollPadding();
}

function applyScrollPadding() {
  const container = els.scoreScroll;
  const itemH = scrollItems.length ? (scrollItems[0].offsetHeight || 52) : 52;
  const half = Math.max(0, (container.offsetHeight - itemH) / 2);
  container.style.paddingTop = half + 'px';
  container.style.paddingBottom = half + 'px';
}

function scoreToIndex(score) {
  return Math.round((score - SCORE_MIN) / SCORE_STEP);
}

function selectByIndex(idx, smooth) {
  idx = Math.max(0, Math.min(SCORES.length - 1, idx));
  state.selScore = SCORES[idx];
  const cls = state.competitor.toLowerCase();
  scrollItems.forEach((item, i) => {
    const sel = i === idx;
    item.className = 'score-item' + (sel ? ' selected ' + cls : '');
    item.setAttribute('aria-selected', sel ? 'true' : 'false');
  });
  els.currentScoreDsp.textContent = state.selScore.toFixed(1);
  els.currentScoreDsp.className = 'current-score-display ' + cls;
  const itemH = scrollItems[0] ? (scrollItems[0].offsetHeight || 52) : 52;
  els.scoreScroll.scrollTo({ top: idx * itemH, behavior: smooth ? 'smooth' : 'instant' });
}

els.scoreScroll.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const itemH = scrollItems[0] ? (scrollItems[0].offsetHeight || 52) : 52;
    const idx = Math.round(els.scoreScroll.scrollTop / itemH);
    if (SCORES[idx] !== undefined && SCORES[idx] !== state.selScore) selectByIndex(idx, false);
  }, 80);
});

/* ---- Open Select Screen ---- */
function openSelect(competitor, startScore) {
  state.competitor = competitor;
  if (startScore === undefined) {
    startScore = (state.displayedScore[competitor] !== null && !state.displayedDQ[competitor])
      ? state.displayedScore[competitor] : SCORE_MIN;
  }
  state.selScore = startScore;
  els.selTitle.textContent = competitor;
  els.selTitle.className = 'sel-title ' + competitor.toLowerCase();
  els.btnShow.className = 'btn btn-show btn-primary-' + competitor.toLowerCase();
  buildScrollList();
  requestAnimationFrame(() => {
    applyScrollPadding();
    selectByIndex(scoreToIndex(startScore), false);
  });
  if (competitor === COMPETITORS.AKA) {
    els.btnSelBack.style.display = 'none';
    els.btnSelNext.style.display = '';
  } else {
    els.btnSelBack.style.display = '';
    els.btnSelNext.style.display = 'none';
  }
  showScreen('select');
}

/* ---- Open Display Screen ---- */
function openDisplay(competitor, score, isDQ) {
  state.competitor = competitor;
  state.displayedScore[competitor] = isDQ ? SCORE_DQ : score;
  state.displayedDQ[competitor] = isDQ;
  const colour = competitor === COMPETITORS.AKA ? 'aka' : 'ao';

  // Apply subtle background tint to the display screen
  const dispScreen = screens.display;
  dispScreen.classList.remove('tint-aka', 'tint-ao', 'tint-dq');
  dispScreen.classList.add(isDQ ? 'tint-dq' : 'tint-' + colour);

  // Competitor label
  els.dispLabel.textContent = competitor;
  els.dispLabel.className = 'disp-label ' + (isDQ ? 'dq' : colour);

  // DQ banner
  els.dispDQText.style.display = isDQ ? 'block' : 'none';

  // Score — always white text (CSS handles it); DQ gets amber via .dq class
  els.dispScore.textContent = isDQ ? '0.0' : score.toFixed(1);
  els.dispScore.className = 'disp-score' + (isDQ ? ' dq' : '');

  // Navigation buttons
  if (competitor === COMPETITORS.AKA) {
    els.btnDispBack.style.display = 'none';
    els.btnDispNextAO.style.display = '';
    els.btnDispNextRound.style.display = 'none';
  } else {
    els.btnDispBack.style.display = '';
    els.btnDispNextAO.style.display = 'none';
    els.btnDispNextRound.style.display = '';
  }
  showScreen('display');
}

/* ---- Dialog ---- */
let dialogResolve = null;
function showDialog(message, confirmLabel, confirmClass) {
  return new Promise(resolve => {
    dialogResolve = resolve;
    els.dialogTitle.textContent = message;
    els.dialogConfirm.textContent = confirmLabel || 'CONFIRM';
    els.dialogConfirm.className = 'btn ' + (confirmClass || 'btn-primary-aka');
    els.dialogOverlay.classList.add('active');
  });
}
function closeDialog(result) {
  els.dialogOverlay.classList.remove('active');
  if (dialogResolve) { dialogResolve(result); dialogResolve = null; }
}
els.dialogConfirm.addEventListener('click', () => closeDialog(true));
els.dialogCancel.addEventListener('click', () => closeDialog(false));
els.dialogOverlay.addEventListener('click', e => { if (e.target === els.dialogOverlay) closeDialog(false); });

/* ---- Home ---- */
$('btn-home-aka').addEventListener('click', () => openSelect(COMPETITORS.AKA));
$('btn-home-ao').addEventListener('click', () => openSelect(COMPETITORS.AO));

/* ---- Select Screen ---- */
els.btnMinus.addEventListener('click', () => {
  const idx = scoreToIndex(state.selScore);
  if (idx > 0) selectByIndex(idx - 1, true);
});
els.btnPlus.addEventListener('click', () => {
  const idx = scoreToIndex(state.selScore);
  if (idx < SCORES.length - 1) selectByIndex(idx + 1, true);
});
els.btnShow.addEventListener('click', () => openDisplay(state.competitor, state.selScore, false));
els.btnDQ.addEventListener('click', async () => {
  const c = state.competitor;
  const ok = await showDialog(
    'Disqualify ' + c + '?\nThis will display 0.0.',
    'YES, DISQUALIFY',
    c === COMPETITORS.AKA ? 'btn-primary-aka' : 'btn-primary-ao'
  );
  if (ok) openDisplay(c, SCORE_DQ, true);
});
els.btnSelNext.addEventListener('click', () => openSelect(COMPETITORS.AO));
els.btnSelBack.addEventListener('click', () => openSelect(COMPETITORS.AKA));

/* ---- Display Screen ---- */
els.btnChange.addEventListener('click', () => {
  const c = state.competitor;
  const prev = (!state.displayedDQ[c] && state.displayedScore[c] !== null)
    ? state.displayedScore[c] : SCORE_MIN;
  openSelect(c, prev);
});
els.btnDispNextAO.addEventListener('click', () => openSelect(COMPETITORS.AO));
els.btnDispBack.addEventListener('click', () => {
  if (state.displayedScore[COMPETITORS.AKA] !== null) {
    openDisplay(COMPETITORS.AKA, state.displayedScore[COMPETITORS.AKA], state.displayedDQ[COMPETITORS.AKA]);
  } else {
    openSelect(COMPETITORS.AKA);
  }
});
els.btnDispNextRound.addEventListener('click', async () => {
  const ok = await showDialog(
    'Start a new round?\nAll current scores will be cleared.',
    'YES, START NEW ROUND',
    'btn-primary-ao'
  );
  if (ok) {
    state.competitor = COMPETITORS.AKA;
    state.selScore = SCORE_MIN;
    state.displayedScore.AKA = null; state.displayedScore.AO = null;
    state.displayedDQ.AKA = false; state.displayedDQ.AO = false;
    showScreen('home');
  }
});

/* ---- Fullscreen ---- */
function fsSupported() {
  return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}
function inFS() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
function toggleFS() {
  if (inFS()) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    const el = document.documentElement;
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  }
}
// All fullscreen toggle buttons across every screen.
const allFSBtns = [
  $('btn-fullscreen-home'),
  $('btn-fullscreen-select'),
  $('btn-fullscreen'),        // display screen
];
function updateFSBtn() {
  const supported = fsSupported();
  const label = inFS() ? '\u26F6 EXIT FULL SCREEN' : '\u26F6 FULL SCREEN';
  allFSBtns.forEach(btn => {
    if (!btn) return;
    btn.style.display = supported ? '' : 'none';
    btn.textContent = label;
  });
}
allFSBtns.forEach(btn => { if (btn) btn.addEventListener('click', toggleFS); });
// NOTE: fullscreenchange listeners that also handle orientation lock
// are registered in the Orientation section below to keep them together.
updateFSBtn();

/* ---- Wake Lock ---- */
let wakeLock = null;
async function acquireWL() {
  if (!('wakeLock' in navigator)) return;
  try {
    if (wakeLock && !wakeLock.released) return;
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch { }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') acquireWL();
});
acquireWL();

/* ---- Orientation Toast ---- */

// True when judge has explicitly accepted portrait layout.
let portraitModeActive = false;
let toastTimer = null;

function isPortrait() {
  // Prefer the Screen Orientation API; fall back to matchMedia.
  if (window.screen && window.screen.orientation) {
    const t = window.screen.orientation.type;
    return t === 'portrait-primary' || t === 'portrait-secondary';
  }
  return window.matchMedia('(orientation: portrait)').matches;
}

function hideToast() {
  clearTimeout(toastTimer);
  els.orientToast.classList.remove('visible');
}

/**
 * Show the orientation toast.
 * @param {'to-portrait'|'to-landscape'|'initial-portrait'} kind
 */
function showOrientToast(kind) {
  clearTimeout(toastTimer);

  if (kind === 'initial-portrait') {
    // Shown on load when already in portrait — ask judge to rotate.
    els.orientToastMsg.textContent = 'Rotate to landscape for best view';
    els.orientToastAccept.textContent = 'USE PORTRAIT';
    els.orientToastAccept.onclick = () => {
      applyPortraitMode(true);
      hideToast();
    };
  } else if (kind === 'to-portrait') {
    // Phone rotated to portrait while app was in landscape.
    els.orientToastMsg.textContent = 'Switch to Portrait Mode?';
    els.orientToastAccept.textContent = 'SWITCH TO PORTRAIT';
    els.orientToastAccept.onclick = () => {
      applyPortraitMode(true);
      hideToast();
    };
  } else if (kind === 'to-landscape') {
    // Phone rotated to landscape while app was in portrait.
    els.orientToastMsg.textContent = 'Switch to Landscape Mode?';
    els.orientToastAccept.textContent = 'SWITCH TO LANDSCAPE';
    els.orientToastAccept.onclick = () => {
      applyPortraitMode(false);
      hideToast();
    };
  }

  els.orientToast.classList.add('visible');

  // Auto-dismiss after 6 seconds — judge doesn't have to act.
  toastTimer = setTimeout(hideToast, 6000);
}

els.orientToastDismiss.addEventListener('click', hideToast);

function applyPortraitMode(enable) {
  portraitModeActive = enable;
  document.body.classList.toggle('portrait-mode', enable);
  // Refresh scroll padding since layout dimensions may have changed.
  requestAnimationFrame(applyScrollPadding);
}

// Try to lock orientation via Screen Orientation API (works in fullscreen).
async function tryLockOrientation(type) {
  if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
    try { await window.screen.orientation.lock(type); } catch { /* not supported or not in fullscreen */ }
  }
}

// When entering fullscreen, lock to landscape (preferred default).
['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => {
  document.addEventListener(ev, () => {
    updateFSBtn();
    if (inFS()) {
      // If judge is in portrait mode, lock to portrait; otherwise landscape.
      tryLockOrientation(portraitModeActive ? 'portrait' : 'landscape');
    } else {
      // Exiting fullscreen — release lock if supported.
      if (window.screen && window.screen.orientation && window.screen.orientation.unlock) {
        try { window.screen.orientation.unlock(); } catch { }
      }
    }
  });
});

// Handle orientation changes.
function onOrientationChange() {
  applyScrollPadding();
  const nowPortrait = isPortrait();
  if (nowPortrait && !portraitModeActive) {
    // Phone is now portrait, but app is in landscape layout.
    showOrientToast('to-portrait');
  } else if (!nowPortrait && portraitModeActive) {
    // Phone is now landscape, but app is in portrait layout.
    showOrientToast('to-landscape');
  } else {
    // Orientation matches current layout — just hide any stale toast.
    hideToast();
  }
}

if (window.screen && window.screen.orientation) {
  window.screen.orientation.addEventListener('change', onOrientationChange);
} else {
  window.addEventListener('orientationchange', onOrientationChange);
}
window.addEventListener('resize', applyScrollPadding);

// On load: if already in portrait, show the initial hint.
if (isPortrait()) showOrientToast('initial-portrait');

/* ---- Keyboard (desktop / accessibility) ---- */
document.addEventListener('keydown', e => {
  if (els.dialogOverlay.classList.contains('active')) {
    if (e.key === 'Escape') closeDialog(false);
    if (e.key === 'Enter') closeDialog(true);
    return;
  }
  if (screens.select.classList.contains('active')) {
    if (e.key === 'ArrowUp') { e.preventDefault(); els.btnMinus.click(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); els.btnPlus.click(); }
    if (e.key === 'Enter') els.btnShow.click();
  }
});
