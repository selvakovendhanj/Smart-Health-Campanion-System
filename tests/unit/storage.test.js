import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Storage } from '../../js/storage.js';

describe('Storage module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ── isAvailable ──────────────────────────────────────────────────────────────

  describe('isAvailable()', () => {
    it('returns true when localStorage is accessible', () => {
      expect(Storage.isAvailable()).toBe(true);
    });

    it('returns false when localStorage.setItem throws (unavailable)', () => {
      // Simulate a browser where localStorage is blocked (e.g. private mode quota)
      vi.spyOn(Storage, 'isAvailable').mockReturnValue(false);
      expect(Storage.isAvailable()).toBe(false);
    });

    it('returns false when localStorage throws on setItem directly', () => {
      const original = localStorage.setItem.bind(localStorage);
      vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      expect(Storage.isAvailable()).toBe(false);
      vi.restoreAllMocks();
    });
  });

  // ── set / get round-trip ─────────────────────────────────────────────────────

  describe('set() and get()', () => {
    it('stores and retrieves a plain object', () => {
      const data = { steps: 8000, water: 2.5 };
      Storage.set('test_key', data);
      expect(Storage.get('test_key')).toEqual(data);
    });

    it('stores and retrieves an array', () => {
      const arr = [1, 2, 3];
      Storage.set('arr_key', arr);
      expect(Storage.get('arr_key')).toEqual(arr);
    });

    it('stores and retrieves a primitive string', () => {
      Storage.set('str_key', 'hello');
      expect(Storage.get('str_key')).toBe('hello');
    });

    it('returns null for a key that was never set', () => {
      expect(Storage.get('nonexistent')).toBeNull();
    });
  });

  // ── corrupt JSON handling (Requirement 9.4 / design error-handling) ──────────

  describe('get() with corrupt JSON', () => {
    it('returns null and does not throw when stored value is corrupt JSON', () => {
      // Bypass Storage.set to inject corrupt data directly
      localStorage.setItem('shc_corrupt_key', '{invalid json:::}');

      expect(() => Storage.get('corrupt_key')).not.toThrow();
      expect(Storage.get('corrupt_key')).toBeNull();
    });

    it('returns null for a truncated JSON string', () => {
      localStorage.setItem('shc_truncated', '{"steps":8000,"water"');
      expect(Storage.get('truncated')).toBeNull();
    });
  });

  // ── remove ───────────────────────────────────────────────────────────────────

  describe('remove()', () => {
    it('removes a previously set key', () => {
      Storage.set('to_remove', { x: 1 });
      Storage.remove('to_remove');
      expect(Storage.get('to_remove')).toBeNull();
    });

    it('does not throw when removing a non-existent key', () => {
      expect(() => Storage.remove('ghost_key')).not.toThrow();
    });
  });

  // ── namespace prefix ─────────────────────────────────────────────────────────

  describe('namespace prefix', () => {
    it('writes the raw localStorage key with shc_ prefix', () => {
      Storage.set('mykey', 42);
      expect(localStorage.getItem('shc_mykey')).toBe('42');
    });

    it('does not expose the un-prefixed key in localStorage', () => {
      Storage.set('mykey', 42);
      expect(localStorage.getItem('mykey')).toBeNull();
    });
  });
});
