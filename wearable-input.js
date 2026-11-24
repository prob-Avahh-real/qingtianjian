/**
 * Canonical wearable input (ring + cane) for Projects workspace.
 * Source of truth: active/air-shared/wearable-input.js
 * Sync copies: node tools/sync-wearable-input.mjs
 */

export const WEARABLE_DEFAULTS = {
  RING_TILT: 5,
  RING_SHAKE: 20,
  CANE_TAP: 8,
  CANE_SWING: 3,
  RING_THROTTLE: 8,
  CANE_THROTTLE: 6,
};

export function createWearableInput(handlers = {}) {
  const {
    RING_TILT,
    RING_SHAKE,
    CANE_TAP,
    CANE_SWING,
    RING_THROTTLE,
    CANE_THROTTLE,
  } = WEARABLE_DEFAULTS;
  const throttleMs = handlers.throttleMs ?? 600;

  let ringFrames = 0;
  let caneFrames = 0;
  let lastBeta = 0;
  let lastGamma = 0;
  let listening = false;
  let orientationHandler = null;
  let motionHandler = null;
  let lastAction = 0;

  function throttleAction(fn, ms = throttleMs) {
    const now = Date.now();
    if (now - lastAction < ms) return;
    lastAction = now;
    fn?.();
  }

  function onRing(e) {
    ringFrames++;
    if (ringFrames % RING_THROTTLE !== 0) return;
    const beta = e.beta ?? 0;
    const gamma = e.gamma ?? 0;
    const dBeta = Math.abs(beta - lastBeta);
    const dGamma = Math.abs(gamma - lastGamma);
    lastBeta = beta;
    lastGamma = gamma;

    if (dBeta > RING_SHAKE || dGamma > RING_SHAKE) {
      throttleAction(() => handlers.onRingShake?.());
      return;
    }
    if (beta > RING_TILT) handlers.onRingTiltDown?.();
    else if (beta < -RING_TILT) handlers.onRingTiltUp?.();
    if (gamma > RING_TILT) handlers.onRingTiltRight?.();
    else if (gamma < -RING_TILT) handlers.onRingTiltLeft?.();
  }

  function onCane(e) {
    caneFrames++;
    if (caneFrames % CANE_THROTTLE !== 0) return;
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
    const spike = Math.abs(mag - 9.8);
    if (spike > CANE_TAP) {
      throttleAction(() => handlers.onCaneTap?.());
      return;
    }
    if (Math.abs(a.x || 0) > CANE_SWING) {
      const dir = (a.x || 0) > 0 ? 'right' : 'left';
      throttleAction(() => {
        handlers.onCaneSwing?.(dir);
        if (dir === 'right') handlers.onCaneSwingRight?.();
        else handlers.onCaneSwingLeft?.();
      }, 800);
    }
  }

  async function requestPermission() {
    let ok = true;
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        ok = (await DeviceOrientationEvent.requestPermission()) === 'granted';
      } catch {
        ok = false;
      }
    }
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        ok = ok && (await DeviceMotionEvent.requestPermission()) === 'granted';
      } catch {
        ok = false;
      }
    }
    return ok;
  }

  function start() {
    if (listening || typeof window === 'undefined') return;
    listening = true;
    orientationHandler = onRing;
    motionHandler = onCane;
    window.addEventListener('deviceorientation', orientationHandler);
    window.addEventListener('devicemotion', motionHandler);
  }

  function stop() {
    if (!listening) return;
    listening = false;
    if (typeof window !== 'undefined') {
      if (orientationHandler) window.removeEventListener('deviceorientation', orientationHandler);
      if (motionHandler) window.removeEventListener('devicemotion', motionHandler);
    }
    orientationHandler = null;
    motionHandler = null;
  }

  return {
    start,
    stop,
    requestPermission,
    isListening: () => listening,
    get listening() {
      return listening;
    },
  };
}

if (typeof window !== 'undefined') {
  window.createWearableInput = createWearableInput;
  window.WEARABLE_DEFAULTS = WEARABLE_DEFAULTS;
}
