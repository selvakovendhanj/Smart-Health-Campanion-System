/**
 * Storage module — thin wrapper around localStorage with shc_ namespace prefix.
 * All modules call Storage.isAvailable() on init; if false, a warning banner is shown.
 */

const PREFIX = 'shc_';

export const Storage = {
  /**
   * Persist a value under the namespaced key.
   * @param {string} key
   * @param {*} value  — will be JSON.stringify'd
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('[Storage] set failed:', e);
    }
  },

  /**
   * Retrieve and JSON.parse a value by key.
   * Returns null (and logs) if the key is missing or the value is corrupt JSON.
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Storage] get failed (corrupt JSON?):', e);
      return null;
    }
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {
      console.warn('[Storage] remove failed:', e);
    }
  },

  /**
   * Probe whether localStorage is available and writable.
   * @returns {boolean}
   */
  isAvailable() {
    const probe = '__shc_probe__';
    try {
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch (e) {
      return false;
    }
  },
};
