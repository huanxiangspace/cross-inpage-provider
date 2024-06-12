/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { JsBridgeBase } from "@onekeyfe/cross-inpage-provider-core";

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
  const bridge: JsBridgeBase = window?.$onekey?.jsBridge;
  const $onekey = {
    ...window.$onekey,
    jsBridge: bridge,
    $private: null,
    $privateExternalAccount: null,
    ethereum: null,
    solana: null,
    phantom: null,
    starcoin: null,
    aptos: null,
    petra: null,
    martian: null,
    conflux: null,
    tronLink: null,
    suiWallet: null,
    unisat: null,
    btcWallet: null,
    algorand: null,
    exodus: null,
    cardano: null,
    keplr: null,
    getOfflineSigner: null,
    getOfflineSignerOnlyAmino: null,
    getOfflineSignerAuto: null,
    webln: null,
    nostr: null,
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

export { injectProperty }
