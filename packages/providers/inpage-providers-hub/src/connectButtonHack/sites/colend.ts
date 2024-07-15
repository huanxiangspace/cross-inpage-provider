import { hackConnectButton } from '../hackConnectButton';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { WALLET_CONNECT_INFO } from '../consts';

export default () => hackConnectButton({
  urls: ['app.colend.xyz'],
  providers: [IInjectedProviderNames.ethereum],
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
      Array.from(document.querySelectorAll<HTMLDivElement>('.MuiBox-root .MuiButton-root')).find((el) => {
        const textNode = el.firstChild;
        if (textNode?.nodeValue === findName) {
          textNode.nodeValue = text;
          el.querySelector<HTMLImageElement>('img')?.setAttribute('src', icon);
          return true;
        }
      })
    };

    if (options?.providers?.includes(IInjectedProviderNames.ethereum)) {
      replaceFunc({
        findName: 'WalletConnect',
        icon: WALLET_CONNECT_INFO.walletconnect.icon,
        text: WALLET_CONNECT_INFO.walletconnect.text,
      });
    }
  },
});
