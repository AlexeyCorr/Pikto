import { computed, readonly, ref } from 'vue';
import { en } from './en';
import { ru } from './ru';
import type { Locale } from './types';

const translations = { en, ru } as const;

const _locale = ref<Locale>('ru');
export const locale = readonly(_locale);
export const t = computed(() => translations[_locale.value]);

export function setLocale(l: Locale): void {
  _locale.value = l;
}

export function detectLocale(): Locale {
  const path = window.location.pathname;
  // prod: /ru/pikto/ or /en/pikto/
  // dev:  /pikto/ru/ or /pikto/en/
  const match = path.match(/\/(ru|en)(?:\/|$)/);
  if (match) return match[1] as Locale;
  return 'ru';
}
