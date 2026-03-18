import { mustGetById } from './dom';
import {
  detectBrowserLanguage,
  getTranslations,
  isValidLanguage,
  type Language,
  type Translations,
} from './i18n';
import { DEFAULT_STATE, loadState, saveState, type GameState } from './storage';

const pointsEl = mustGetById<HTMLDivElement>('points');
const ppsEl = mustGetById<HTMLDivElement>('pps');
const tapBtn = mustGetById<HTMLButtonElement>('tap');
const buyAutoBtn = mustGetById<HTMLButtonElement>('buyAuto');
const autoPriceEl = mustGetById<HTMLSpanElement>('autoPrice');
const toastEl = mustGetById<HTMLDivElement>('toast');
const languageSelect = mustGetById<HTMLSelectElement>('language');

let state: GameState = DEFAULT_STATE;
let i18n: Translations = getTranslations('en');

function setAutoTapLabel(el: HTMLElement): void {
  const autoTapNoun = state.language === 'pt-br' ? 'Toque' : 'Tap';
  el.textContent = '';

  const strong = document.createElement('strong');
  strong.textContent = 'Auto';
  el.append(strong, ` ${autoTapNoun} (+1/s)`);
}

function updateTranslations(): void {
  i18n = getTranslations(state.language);

  // Update all elements with data-i18n attribute
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key || !(key in i18n)) return;

    const translation = i18n[key as keyof Translations];
    if (el.tagName === 'BUTTON' || el.tagName === 'SPAN') {
      // Keep the emphasized "Auto" label without using dynamic HTML.
      if (key === 'autoTap') {
        setAutoTapLabel(el);
      } else {
        el.textContent = translation;
      }
    } else {
      el.textContent = translation;
    }
  });

  // Update language selector
  languageSelect.value = state.language;
}

function render(): void {
  pointsEl.textContent = String(Math.floor(state.points));
  ppsEl.textContent = String(state.pps);
  autoPriceEl.textContent = `(${state.autoPrice})`;

  buyAutoBtn.disabled = state.points < state.autoPrice;
}

function toast(msg: string): void {
  toastEl.textContent = msg;
  window.setTimeout(() => {
    if (toastEl.textContent === msg) toastEl.textContent = '';
  }, 1200);
}

function setState(next: GameState): void {
  state = next;
  render();
  void saveState(state);
}

function addPoints(amount: number): void {
  setState({ ...state, points: state.points + amount });
}

function buyAutoTap(): void {
  if (state.points < state.autoPrice) {
    toast(i18n.notEnoughPoints);
    return;
  }

  const next: GameState = {
    ...state,
    points: state.points - state.autoPrice,
    pps: state.pps + 1,
    autoPrice: Math.floor(state.autoPrice * 1.5),
  };

  setState(next);
  toast(i18n.autoTapBought);
}

function changeLanguage(lang: string): void {
  if (!isValidLanguage(lang)) return;

  setState({ ...state, language: lang });
  updateTranslations();
}

async function main(): Promise<void> {
  state = await loadState();

  // Auto-detect browser language on first run (when language is still default)
  if (state.language === DEFAULT_STATE.language) {
    const detectedLanguage = detectBrowserLanguage();
    if (detectedLanguage !== state.language) {
      state = { ...state, language: detectedLanguage };
      await saveState(state);
    }
  }

  updateTranslations();
  render();

  tapBtn.addEventListener('click', () => addPoints(1));
  buyAutoBtn.addEventListener('click', buyAutoTap);
  languageSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    changeLanguage(target.value);
  });

  window.setInterval(() => {
    if (state.pps > 0) addPoints(state.pps);
  }, 1000);
}

void main();
