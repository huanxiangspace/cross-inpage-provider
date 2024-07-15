import { hackConnectButton } from '../hackConnectButton';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { WALLET_CONNECT_INFO } from '../consts';

export default () => hackConnectButton({
  urls: ['hive.bsquared.network'],
  providers: [IInjectedProviderNames.ethereum, IInjectedProviderNames.btc],
  replaceMethod(options) {
    const replaceFunc = ({
      findName,
      icon,
      text,
    }: {
      findName: string;
      icon: string;
      text: string;
    }) => {
      const items: HTMLElement[] = Array.from(document.querySelectorAll(`div[class^=_walletItem]`));
      let imgElement;
      let textElement;
      items.find((el) => {
        textElement = el.querySelector<HTMLDivElement>('img+div');
        if (textElement && textElement.innerHTML === findName) {
          imgElement = textElement.previousElementSibling;
          return true;
        }
        return false;
      });

      if (textElement) {
        (textElement as HTMLDivElement).innerHTML = text;
      }

      if (imgElement) {
        (imgElement as HTMLImageElement).setAttribute('src', icon);
      }
    };

    if (options?.providers?.includes(IInjectedProviderNames.ethereum)) {
      replaceFunc({
        findName: 'MetaMask',
        icon: WALLET_CONNECT_INFO.metamask.icon,
        text: WALLET_CONNECT_INFO.metamask.text,
      });
    }

    if (options?.providers?.includes(IInjectedProviderNames.btc)) {
      replaceFunc({
        findName: 'UniSat Wallet',
        icon: WALLET_CONNECT_INFO.unisat.icon,
        text: WALLET_CONNECT_INFO.unisat.text,
      });
    }
  },
});
