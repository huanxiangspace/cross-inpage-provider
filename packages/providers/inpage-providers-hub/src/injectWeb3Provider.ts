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
  debugLogger?: any;
  jsBridge?: JsBridgeBase;
  ethereum?: ProviderEthereum;
  solana?: ProviderSolana;
  phantom?: { solana?: ProviderSolana };
  starcoin?: any;
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

function injectWeb3Provider(): unknown {
  if (!window?.$onekey?.jsBridge) {
    throw new Error('OneKey jsBridge not found.');
  }
  
  const bridge: JsBridgeBase = window?.$onekey?.jsBridge;

  window.$onekey.$private = new ProviderPrivate({
    bridge,
  });

  const solana = new ProviderSolana({
    bridge,
  });
  window.$onekey.solana = solana;
  window.$onekey.phantom = {
    solana: solana,
  };

  window.$onekey.starcoin = new ProviderStarcoin({
    bridge,
  });

  const aptos = new ProviderAptosMartian({
    bridge,
  });
  window.$onekey.aptos = aptos;
  window.$onekey.petra = aptos;
  window.$onekey.martian = new Proxy(aptos, {
    get: (target, property, ...args) => {
      if (property === 'aptosProviderType') {
        return 'martian';
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, property, ...args);
    },
  });

  window.$onekey.conflux = new ProviderConflux({
    bridge,
  });

  window.$onekey.tronLink = new ProviderTron({
    bridge,
  });

  const sui = new ProviderSui({
    bridge,
  });
  window.$onekey.suiWallet = sui;

  window.$onekey.unisat = new ProviderBtc({ bridge });
  window.$onekey.btcWallet = new ProviderBtcWallet({ bridge });

  const algorand = new ProviderAlgo({ bridge });
  window.$onekey.algorand = algorand;
  window.$onekey.exodus = {
    algorand,
  };

  // Cardano chain provider injection is handled independently.
  if (checkWalletSwitchEnable()) {
    window.$onekey.cardano = new ProviderCardano({
      bridge,
    });
  } else {
    window.$onekey.cardano = window.cardano;
  }

  // cosmos keplr
  const cosmos = new ProviderCosmos({
    bridge,
  });
  window.$onekey.keplr = cosmos;
  window.$onekey.getOfflineSigner = cosmos.getOfflineSigner.bind(cosmos);
  window.$onekey.getOfflineSignerOnlyAmino = cosmos.getOfflineSignerOnlyAmino.bind(cosmos);
  window.$onekey.getOfflineSignerAuto = cosmos.getOfflineSignerAuto.bind(cosmos);

  // Lightning Network
  window.$onekey.webln = new ProviderWebln({
    bridge,
  });
  window.$onekey.nostr = new ProviderNostr({
    bridge,
  });

  window.$onekey.$privateExternalAccount = new ProviderPrivateExternalAccount({ bridge });

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
    registerSolanaWallet(solana, {
      icon: WALLET_CONNECT_INFO.onekey.icon as WalletIcon,
    });
  }

  // Sui Standard Wallet
  if (checkWalletSwitchEnable()) {
    registerSuiWallet(sui, {
      logo: WALLET_CONNECT_INFO.onekey.icon,
    });
  }

  // Override the SuiWallet Standard Wallet
  if (checkWalletSwitchEnable()) {
    registerSuiWallet(sui, {
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
