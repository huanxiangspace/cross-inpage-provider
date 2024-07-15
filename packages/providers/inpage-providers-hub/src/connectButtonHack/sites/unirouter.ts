import { hackConnectButton } from '../hackConnectButton';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { WALLET_CONNECT_INFO } from '../consts';

export default () => hackConnectButton({
  urls: ['app.unirouter.io'],
  providers: [IInjectedProviderNames.btc],
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
      const imgNode = document.querySelector<HTMLImageElement>(`img[alt="${findName}"]`);
      if (imgNode) {
        icon && imgNode.setAttribute('src', icon);
        imgNode.setAttribute('alt', text);
        const textNode = imgNode.nextElementSibling as HTMLDivElement | null;
        if (textNode) {
          textNode.innerText = text;
          textNode.classList.remove('text-nowrap')
        }
      }
    };

    if (options?.providers?.includes(IInjectedProviderNames.btc)) {
      replaceFunc({
        findName: 'Unisat Wallet',
        icon: WALLET_CONNECT_INFO.unisat.icon,
        text: WALLET_CONNECT_INFO.unisat.text,
      });
    }
  },
});
