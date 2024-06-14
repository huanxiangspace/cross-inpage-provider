import { JsBridgeNativeInjected } from '@onekeyfe/native-bridge-injected';
import { injectWeb3Provider } from '@onekeyfe/inpage-providers-hub';

import {
  injectedProviderReceiveHandler,
  injectJsBridge,
} from '@onekeyfe/cross-inpage-provider-core';
import { injectProperty } from './inject/property';

const bridge = () =>
  new JsBridgeNativeInjected({
    receiveHandler: injectedProviderReceiveHandler,
  });
injectJsBridge(bridge);

injectProperty();
injectWeb3Provider();

// eslint-disable-next-line no-void
void 0;
