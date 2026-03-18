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

type ExtensionStorageAPI = {
  storage: {
    local: {
      get(items: Record<string, unknown>): Promise<Record<string, unknown>>;
      set(items: Record<string, unknown>): Promise<void>;
    };
  };
};

function getExtensionAPI(): ExtensionStorageAPI {
  const api =
    (
      globalThis as typeof globalThis & {
        browser?: ExtensionStorageAPI;
        chrome?: ExtensionStorageAPI;
      }
    ).browser ??
    (
      globalThis as typeof globalThis & {
        browser?: ExtensionStorageAPI;
        chrome?: ExtensionStorageAPI;
      }
    ).chrome;

  if (!api) {
    throw new Error('Browser extension API is not available.');
  }

  return api;
}

export async function loadState(): Promise<GameState> {
  const extensionAPI = getExtensionAPI();
  const data = (await extensionAPI.storage.local.get(
    DEFAULT_STATE as Record<string, unknown>,
  )) as Partial<GameState>;

  return {
    points: data.points ?? DEFAULT_STATE.points,
    pps: data.pps ?? DEFAULT_STATE.pps,
    autoPrice: data.autoPrice ?? DEFAULT_STATE.autoPrice,
    language: data.language ?? DEFAULT_STATE.language,
  };
}

export async function saveState(state: GameState): Promise<void> {
  const extensionAPI = getExtensionAPI();
  await extensionAPI.storage.local.set(state as Record<string, unknown>);
}
