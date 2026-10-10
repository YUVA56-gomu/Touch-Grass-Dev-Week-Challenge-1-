import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Polyfill scrollIntoView for JSDOM
if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Automatically cleanup DOM after each test
afterEach(() => {
  cleanup();
});
