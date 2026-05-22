import { describe, expect, it } from 'vitest';
import { detectLocale } from './index';

function withPath(path: string, fn: () => void) {
  const original = window.location.pathname;
  Object.defineProperty(window, 'location', {
    value: { ...window.location, pathname: path },
    writable: true,
    configurable: true,
  });
  fn();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, pathname: original },
    writable: true,
    configurable: true,
  });
}

describe('detectLocale', () => {
  it('detects en from /pikto/en/ (trailing slash)', () => {
    withPath('/pikto/en/', () => expect(detectLocale()).toBe('en'));
  });

  it('detects en from /pikto/en (no trailing slash)', () => {
    withPath('/pikto/en', () => expect(detectLocale()).toBe('en'));
  });

  it('detects ru from /pikto/ru/', () => {
    withPath('/pikto/ru/', () => expect(detectLocale()).toBe('ru'));
  });

  it('detects ru from /pikto/ru (no trailing slash)', () => {
    withPath('/pikto/ru', () => expect(detectLocale()).toBe('ru'));
  });

  it('detects en from /en/pikto/ (prod path)', () => {
    withPath('/en/pikto/', () => expect(detectLocale()).toBe('en'));
  });

  it('falls back to ru when no locale segment found', () => {
    withPath('/pikto/', () => expect(detectLocale()).toBe('ru'));
  });

  it('does not match "en" inside unrelated path segment', () => {
    withPath('/content/engine/pikto/', () => expect(detectLocale()).toBe('ru'));
  });
});
