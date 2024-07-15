import { hackConnectButton } from '../hackConnectButton';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { WALLET_CONNECT_INFO } from '../consts';

export default () => hackConnectButton({
  urls: ['tornado.ws'],
  providers: [IInjectedProviderNames.ethereum],
  replaceMethod(options) {
    const replaceFunc = ({
      findName,
      text,
    }: {
      findName: string;
      icon: string;
      text: string;
    }) => {
      const element = document.querySelector<HTMLButtonElement>(`button[data-test="${findName}"]`);
      if (!element) {
        return;
      }
      element.innerText = text;
    };

    if (options?.providers?.includes(IInjectedProviderNames.ethereum)) {
      if (!document.getElementById('onekey-style')) {
        const style = document.createElement('style');
        style.id = 'onekey-style';
        style.innerHTML = `
.wallets .button{width:150px !important;}
.wallets .button.is-metamask:before{background-image:url(${WALLET_CONNECT_INFO.metamask.icon}) !important;}
.wallets .button.is-walletConnect:before{background-image:url(${WALLET_CONNECT_INFO.walletconnect.icon}) !important;}
`;
        document.head.appendChild(style);
      }
      replaceFunc({
        findName: 'choose_metamask_option',
        icon: WALLET_CONNECT_INFO.metamask.icon,
        text: WALLET_CONNECT_INFO.metamask.text,
      });
      replaceFunc({
        findName: 'choose_wallet_option',
        icon: WALLET_CONNECT_INFO.walletconnect.icon,
        text: WALLET_CONNECT_INFO.walletconnect.text,
      });
    }
  },
});
