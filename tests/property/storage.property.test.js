// Feature: smart-health-companion, Property 18: Storage keys are namespaced

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { Storage } from '../../js/storage.js';

/**
 * Property 18: Storage keys are namespaced
 *
 * For any call to Storage.set(key, value), the actual key written to
 * localStorage should start with the prefix "shc_".
 *
 * Validates: Requirements 9.3
 */
describe('Property 18: Storage keys are namespaced', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('every key written to localStorage starts with "shc_"', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary key strings (non-empty to avoid edge cases with blank keys)
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.jsonValue(),
        (key, value) => {
          localStorage.clear();

          Storage.set(key, value);

          // Every key currently in localStorage must start with "shc_"
          for (let i = 0; i < localStorage.length; i++) {
            const storedKey = localStorage.key(i);
            expect(storedKey).toMatch(/^shc_/);
          }

          // The specific key we wrote must be retrievable as "shc_" + key
          const rawKey = 'shc_' + key;
          expect(localStorage.getItem(rawKey)).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
