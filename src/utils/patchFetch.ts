/**
 * Global fetch safeguard
 * Protects against environments where `window.fetch` or `Window.prototype.fetch`
 * is configured as a getter without a setter, preventing "TypeError: Cannot set property fetch of #<Window> which has only a getter"
 */

(function installFetchSafeguard() {
  if (typeof window === 'undefined') return;

  try {
    const protoDesc = typeof Window !== 'undefined' && Window.prototype 
      ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch') 
      : null;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');

    const needsSetter = 
      (desc && desc.get && !desc.set && desc.configurable !== false) ||
      (!desc && protoDesc && !protoDesc.set) ||
      (protoDesc && protoDesc.get && !protoDesc.set);

    if (needsSetter || (!desc && typeof window.fetch === 'function')) {
      let currentFetch = window.fetch;
      try {
        Object.defineProperty(window, 'fetch', {
          get() {
            return currentFetch;
          },
          set(newFetch) {
            currentFetch = newFetch;
          },
          configurable: true,
          enumerable: true
        });
      } catch {
        // Non-fatal if already sealed
      }
    }

    // Intercept Object.defineProperty to ensure any future definitions of fetch include a setter
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function (obj: any, prop: PropertyKey, descriptor: PropertyDescriptor & ThisType<any>) {
      try {
        if ((obj === window || (typeof Window !== 'undefined' && obj === Window.prototype)) && prop === 'fetch') {
          if (descriptor && descriptor.get && !descriptor.set && descriptor.configurable !== false) {
            let overriddenFetch: any = undefined;
            let hasOverride = false;
            const origGetCall = descriptor.get;
            descriptor.set = function (v: any) {
              hasOverride = true;
              overriddenFetch = v;
            };
            descriptor.get = function () {
              return hasOverride ? overriddenFetch : origGetCall.call(this);
            };
          }
        }
      } catch {
        // Ignore descriptor enhancement errors
      }
      return originalDefineProperty.apply(this, [obj, prop, descriptor]);
    };
  } catch {
    // Non-fatal
  }
})();

export {};
