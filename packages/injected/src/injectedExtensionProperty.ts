/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

function defineProperty(name: string, value?: any, options?: {
  enumerable?: boolean;
}) {
  Object.defineProperty(window, name, {
    enumerable: options?.enumerable,
    configurable: false,
    get: () => {
      if (value) {
        return value;
      }
      return window?.$onekey?.[name];
    },
    set: () => void 0,
  })
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
function injectProperty(): void {
  const $onekey = {
    ...window.$onekey,
    jsBridge: null,
    $private: null,
    $privateExternalAccount: null,
    ethereum: null,
    solana: null,
    starcoin: null,
    aptos: null,
    conflux: null,
    tron: null,
    sollet: null,
    sui: null,
    cardano: null,
    cosmos: null,
    webln: null,
    nostr: null,
    btc: null,
    btcwallet: null,
    algorand: null,
  };
  const enumerableMap: Record<string, boolean> = {
    petra: true,
    martian: true,
  };

  defineProperty('$onekey', $onekey, {
    enumerable: true,
  });
  for (const key in $onekey) {
    defineProperty(key, $onekey[key], {
      enumerable: enumerableMap[key] ?? false,
    });
  }
}

injectProperty();

console.log('OneKey Property Ready ', performance.now());

// FIX: Error evaluating injectedJavaScript: This is possibly due to an unsupported return type. Try adding true to the end of your injectedJavaScript string.
// eslint-disable-next-line no-void
void 0;
