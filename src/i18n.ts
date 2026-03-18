export type Language = 'en' | 'pt-br';

export type Translations = {
  // Header
  title: string;
  subtitle: string;
  insertCoin: string;

  // Stats
  score: string;
  perSecond: string;

  // Actions
  tap: string;
  autoTap: string;

  // Messages
  notEnoughPoints: string;
  autoTapBought: string;

  // Footer
  developedBy: string;

  // Language
  language: string;
};

const translations: Record<Language, Translations> = {
  en: {
    // Header
    title: 'QUICK TAP',
    subtitle: 'Tap fast. Grow forever.',
    insertCoin: 'INSERT COIN',

    // Stats
    score: 'Score',
    perSecond: 'Per second',

    // Actions
    tap: 'TAP!',
    autoTap: 'Auto Tap (+1/s)',

    // Messages
    notEnoughPoints: 'Not enough points.',
    autoTapBought: '+1 / second!',

    // Footer
    developedBy: 'Developed by',

    // Language
    language: 'Language',
  },
  'pt-br': {
    // Header
    title: 'QUICK TAP',
    subtitle: 'Toque rápido. Cresça para sempre.',
    insertCoin: 'INSIRA MOEDA',

    // Stats
    score: 'Pontos',
    perSecond: 'Por segundo',

    // Actions
    tap: 'TOQUE!',
    autoTap: 'Toque Auto (+1/s)',

    // Messages
    notEnoughPoints: 'Pontos insuficientes.',
    autoTapBought: '+1 / segundo!',

    // Footer
    developedBy: 'Desenvolvido por',

    // Language
    language: 'Idioma',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function isValidLanguage(lang: string): lang is Language {
  return lang === 'en' || lang === 'pt-br';
}

export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();

  // Check if browser language contains 'pt' (Portuguese)
  if (browserLang.startsWith('pt')) {
    return 'pt-br';
  }

  // Default to English for any other language
  return 'en';
}
