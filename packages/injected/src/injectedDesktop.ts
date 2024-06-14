import { JsBridgeDesktopInjected } from '@onekeyfe/desktop-bridge-injected';
import {
  injectedProviderReceiveHandler,
  injectJsBridge,
} from '@onekeyfe/cross-inpage-provider-core';

import { injectWeb3Provider } from '@onekeyfe/inpage-providers-hub';
import { injectProperty } from './inject/property';

const bridge = () =>
  new JsBridgeDesktopInjected({
    receiveHandler: injectedProviderReceiveHandler,
  });
injectJsBridge(bridge);

injectProperty();
injectWeb3Provider();

// eslint-disable-next-line no-void
void 0;
