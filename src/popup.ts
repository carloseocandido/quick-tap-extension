import { mustGetById } from './dom';
import { DEFAULT_STATE, loadState, saveState, type GameState } from './storage';

const pointsEl = mustGetById<HTMLDivElement>('points');
const ppsEl = mustGetById<HTMLDivElement>('pps');
const tapBtn = mustGetById<HTMLButtonElement>('tap');
const buyAutoBtn = mustGetById<HTMLButtonElement>('buyAuto');
const autoPriceEl = mustGetById<HTMLSpanElement>('autoPrice');
const toastEl = mustGetById<HTMLDivElement>('toast');

let state: GameState = DEFAULT_STATE;

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
    toast('Not enough points.');
    return;
  }

  const next: GameState = {
    points: state.points - state.autoPrice,
    pps: state.pps + 1,
    autoPrice: Math.floor(state.autoPrice * 1.5),
  };

  setState(next);
  toast('+1 / second!');
}

async function main(): Promise<void> {
  state = await loadState();
  render();

  tapBtn.addEventListener('click', () => addPoints(1));
  buyAutoBtn.addEventListener('click', buyAutoTap);

  window.setInterval(() => {
    if (state.pps > 0) addPoints(state.pps);
  }, 1000);
}

void main();
