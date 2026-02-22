import type { Language } from './i18n';

export type GameState = {
  points: number;
  pps: number; // points per second
  autoPrice: number;
  language: Language;
};

export const DEFAULT_STATE: GameState = {
  points: 0,
  pps: 0,
  autoPrice: 50,
  language: 'en',
};

export async function loadState(): Promise<GameState> {
  const data = (await chrome.storage.local.get(DEFAULT_STATE)) as Partial<GameState>;

  return {
    points: data.points ?? DEFAULT_STATE.points,
    pps: data.pps ?? DEFAULT_STATE.pps,
    autoPrice: data.autoPrice ?? DEFAULT_STATE.autoPrice,
    language: data.language ?? DEFAULT_STATE.language,
  };
}

export async function saveState(state: GameState): Promise<void> {
  await chrome.storage.local.set(state);
}
