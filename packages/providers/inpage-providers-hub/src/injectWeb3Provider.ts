/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JsBridgeBase } from '@onekeyfe/cross-inpage-provider-core';
import { ProviderEthereum, shimWeb3, registerEIP6963Provider } from '@onekeyfe/onekey-eth-provider';
import { ProviderPrivate } from '@onekeyfe/onekey-private-provider';
import { ProviderSolana, registerSolanaWallet, WalletIcon } from '@onekeyfe/onekey-solana-provider';
import { ProviderStarcoin } from '@onekeyfe/onekey-starcoin-provider';
import { ProviderAptos, ProviderAptosMartian } from '@onekeyfe/onekey-aptos-provider';
import { ProviderConflux } from '@onekeyfe/onekey-conflux-provider';
import { ProviderTron } from '@onekeyfe/onekey-tron-provider';
import { ProviderCardano } from '@onekeyfe/onekey-cardano-provider';
import { ProviderPrivateExternalAccount } from '@onekeyfe/onekey-private-external-account-provider';
import { ProviderCosmos } from '@onekeyfe/onekey-cosmos-provider';
import { ProviderPolkadot, registerPolkadot } from '@onekeyfe/onekey-polkadot-provider';
import {
  checkWalletSwitchEnable,
} from '@onekeyfe/cross-inpage-provider-core';
import { ProviderSui, registerSuiWallet } from '@onekeyfe/onekey-sui-provider';
import { ProviderWebln } from '@onekeyfe/onekey-webln-provider';
import { ProviderNostr } from '@onekeyfe/onekey-nostr-provider';
import { ProviderBtc, ProviderBtcWallet } from '@onekeyfe/onekey-btc-provider';
import { ProviderAlgo } from '@onekeyfe/onekey-algo-provider';
import { hackAllConnectButtons } from './connectButtonHack';
import { detectWebsiteRiskLevel } from './detectRiskWebsite';
import { WALLET_CONNECT_INFO } from './connectButtonHack/consts';
// import Web3 from 'web3'; // cause build error

export type IWindowOneKeyHub = {
  debugLogger?: unknown;
  jsBridge?: JsBridgeBase;
  ethereum?: ProviderEthereum;
  solana?: ProviderSolana;
  phantom?: { solana?: ProviderSolana };
  starcoin?: unknown;
  aptos?: ProviderAptos;
  petra?: ProviderAptos;
  martian?: ProviderAptosMartian;
  suiWallet?: ProviderSui;
  cardano?: ProviderCardano;
  keplr?: ProviderCosmos;
  webln?: ProviderWebln;
  nostr?: ProviderNostr;
  unisat?: ProviderBtc;
  btcwallet?: ProviderBtcWallet;
  $private?: ProviderPrivate;
  $walletInfo?: {
    buildNumber: string;
    disableExt?: boolean;
    isLegacy: boolean;
    isDefaultWallet?: boolean;
    excludedDappList: string[];
    platform: string;
    version: string;
    platformEnv: {
      isExtension: boolean;
      isDesktop: boolean;
      isNative: boolean;
    };
  };
};


function lazyInitProvider<T>(name: string, createProvider: () => T) {
  let provider: T;
  Object.defineProperty(window.$onekey, name, {
    enumerable: true,
    configurable: false,
    get: () => {
      if (!provider) {
        provider = createProvider();
      }
      return provider;
    },
    set: () => void 0,
  })
}

function injectWeb3Provider(): unknown {
  if (!window?.$onekey?.jsBridge) {
    throw new Error('OneKey jsBridge not found.');
  }
  
  const bridge: JsBridgeBase = window?.$onekey?.jsBridge;

  lazyInitProvider('$private', () => new ProviderPrivate({
    bridge,
  }));

  const createSolanaProvider = () => new ProviderSolana({
    bridge,
  });
  lazyInitProvider('solana', createSolanaProvider);
  lazyInitProvider('phantom', () => ({
    solana: createSolanaProvider(),
  }));

  lazyInitProvider('starcoin', () => new ProviderStarcoin({
    bridge,
  }));

  const createAptosProvider = () => new ProviderAptosMartian({
    bridge,
  });
  lazyInitProvider('aptos', createAptosProvider);
  lazyInitProvider('petra', createAptosProvider);
  lazyInitProvider('martian', () => {
    const aptos = createAptosProvider();
    return new Proxy(aptos, {
      get: (target, property, ...args) => {
        if (property === 'aptosProviderType') {
          return 'martian';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Reflect.get(target, property, ...args);
      },
    });
  });

  lazyInitProvider('conflux', () => new ProviderConflux({
    bridge,
  }));

  const createTronProvider = () => new ProviderTron({
    bridge,
  });
  lazyInitProvider('tron', createTronProvider);
  lazyInitProvider('tronLink', createTronProvider);

  const createSuiProvider = () => new ProviderSui({
    bridge,
  });
  lazyInitProvider('suiWallet', createSuiProvider);

  const createBtcProvider = () => new ProviderBtc({
    bridge,
  });
  lazyInitProvider('btc', createBtcProvider);
  lazyInitProvider('unisat', createBtcProvider);

  lazyInitProvider('btcwallet', () => new ProviderBtcWallet({ bridge }));

  const createAlgorandProvider = () => new ProviderAlgo({ bridge });
  lazyInitProvider('algorand', createAlgorandProvider);
  lazyInitProvider('exodus', () => ({
    algorand: createAlgorandProvider(),
  }));

  // Cardano chain provider injection is handled independently.
  if (checkWalletSwitchEnable()) {
    lazyInitProvider('cardano', () => new ProviderCardano({
      bridge,
    }));
  } else {
    lazyInitProvider('cardano', () => window.cardano as ProviderCardano);
  }

  // cosmos keplr
  let cosmos: ProviderCosmos;
  const createCosmosProvider = () => {
    if (!cosmos) {
      cosmos = new ProviderCosmos({
        bridge,
      });
    }
    return cosmos;
  };
  lazyInitProvider('cosmos', createCosmosProvider);
  lazyInitProvider('keplr', createCosmosProvider);
  lazyInitProvider('getOfflineSigner', () => {
    const cosmos = createCosmosProvider();
    return cosmos.getOfflineSigner.bind(cosmos);
  });
  lazyInitProvider('getOfflineSignerOnlyAmino', () => {
    const cosmos = createCosmosProvider();
    return cosmos.getOfflineSignerOnlyAmino.bind(cosmos);
  });
  lazyInitProvider('getOfflineSignerAuto', () => {
    const cosmos = createCosmosProvider();
    return cosmos.getOfflineSignerAuto.bind(cosmos);
  });

  // Lightning Network
  lazyInitProvider('webln', () => new ProviderWebln({
    bridge,
  }));
  lazyInitProvider('nostr', () => new ProviderNostr({
    bridge,
  }));

  lazyInitProvider('$privateExternalAccount', () => new ProviderPrivateExternalAccount({ bridge }));

  const ethereum = new ProviderEthereum({
    bridge,
  });
  window.$onekey.ethereum = ethereum;
  registerEIP6963Provider({
    image: WALLET_CONNECT_INFO.onekey.icon,
    provider: ethereum,
  });
  if (checkWalletSwitchEnable()) {
    registerEIP6963Provider({
      uuid: '7677b54f-3486-46e2-4e37-bf8747814f',
      name: 'MetaMask',
      rdns: 'io.metamask',
      image: WALLET_CONNECT_INFO.metamask.icon,
      provider: ethereum,
    });
  }
  shimWeb3(ethereum);

  // TODO use initializeInpageProvider.ts
  window.dispatchEvent(new Event('ethereum#initialized'));

  // Solana Standard Wallet
  if (checkWalletSwitchEnable()) {
    registerSolanaWallet(createSolanaProvider(), {
      icon: WALLET_CONNECT_INFO.onekey.icon as WalletIcon,
    });
  }

  // Sui Standard Wallet
  if (checkWalletSwitchEnable()) {
    registerSuiWallet(createSuiProvider(), {
      logo: WALLET_CONNECT_INFO.onekey.icon,
    });
  }

  // Override the SuiWallet Standard Wallet
  if (checkWalletSwitchEnable()) {
    registerSuiWallet(createSuiProvider(), {
      name: 'Sui Wallet',
      logo: WALLET_CONNECT_INFO.onekey.icon,
    });
  }

  if (checkWalletSwitchEnable()) {
    const polkadot = new ProviderPolkadot({
      bridge,
    });
    registerPolkadot(polkadot);
    registerPolkadot(polkadot, 'polkadot-js', '0.44.1');
  }

  setTimeout(() => {
    void detectWebsiteRiskLevel();
    void hackAllConnectButtons();
  }, 1000);

  return window.$onekey;
}

export { injectWeb3Provider };
