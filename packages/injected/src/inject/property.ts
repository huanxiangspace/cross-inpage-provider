/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

function defineProperty(name: string, value?: unknown, options?: {
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
export function injectProperty(): void {
  const $onekey: Record<string, unknown> = {
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
    tron: null,
    tronLink: null,
    sui: null,
    suiWallet: null,
    unisat: null,
    btc: null,
    btcwallet: null,
    algorand: null,
    exodus: null,
    cardano: null,
    cosmos: null,
    keplr: null,
    getOfflineSigner: null,
    getOfflineSignerOnlyAmino: null,
    getOfflineSignerAuto: null,
    webln: null,
    nostr: null,
    ...window.$onekey,
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
