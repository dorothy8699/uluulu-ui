/* Standalone UI demo: no network, wallet provider or transaction calls. */
(() => {
  'use strict';
  const prefix = 'uluulu-offline-demo-v1:';
  function storage(kind) {
    const memory = new Map();
    let native;
    try { native = window[kind]; } catch {}
    return {
      getItem(key) {
        if (memory.has(key)) return memory.get(key);
        try { return native?.getItem(prefix + key) ?? null; } catch { return null; }
      },
      setItem(key, value) {
        memory.set(key, String(value));
        try { native?.setItem(prefix + key, String(value)); } catch {}
      },
      removeItem(key) {
        memory.delete(key);
        try { native?.removeItem(prefix + key); } catch {}
      }
    };
  }
  window.uluuluDemoStorage = {
    local: storage('localStorage'),
    session: storage('sessionStorage')
  };
})();
