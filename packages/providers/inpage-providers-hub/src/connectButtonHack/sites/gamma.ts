import { createNewImageToContainer, hackConnectButton } from '../hackConnectButton';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { WALLET_CONNECT_INFO } from '../consts';

export default () => hackConnectButton({
  urls: ['gamma.io','www.gamma.io'],
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
      const buttonList = Array.from(document.querySelectorAll('#headlessui-portal-root button'));
      const btn = buttonList.find((item) => item.innerHTML.includes(findName));
      const textNode = btn?.querySelector('div:last-child>div');
      if (textNode?.innerHTML === findName) {
        textNode.innerHTML = text;
      }
      const imgContainer = btn?.querySelector('div');
      if (imgContainer) {
        createNewImageToContainer({
          container: imgContainer,
          icon: icon,
          removeSvg: true,
          onCreated(img) {
            img.style.maxWidth = '32px';
            img.style.maxHeight = '32px';
          },
        });
      }
    };

    if (options?.providers?.includes(IInjectedProviderNames.btc)) {
      replaceFunc({
        findName: 'Unisat',
        icon: WALLET_CONNECT_INFO.unisat.icon,
        text: WALLET_CONNECT_INFO.unisat.text,
      });
    }
  },
});
