import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';
import { hackConnectButton } from '../hackConnectButton';
import { SitesInfo, sitesConfig } from './config';
import { findIconAndNameByParent as defaultFindIconAndName } from './findIconAndName';
import { replaceIcon as defaultReplaceIcon } from './imgUtils';
import { replaceText as defaultReplaceText } from './textUtils';
import { FindResultType } from './type';
import { universalLog, getWalletId } from './utils';
import { noop } from 'lodash';

function hackWalletConnectButton(sites: SitesInfo[]) {
  for (const site of sites) {
    const { urls, walletsForProvider } = site;
    const providers = Object.keys(walletsForProvider) as IInjectedProviderNames[];
    hackConnectButton({
      urls,
      providers,
      replaceMethod(
        { providers: enabledProviders }: { providers: IInjectedProviderNames[] } = {
          providers: [],
        },
      ) {
        for (const provider of providers) {
          if (enabledProviders.includes(provider)) {
            const wallets = walletsForProvider[provider] || [];
            for (const wallet of wallets) {
              const {
                updatedIcon,
                updatedName,
                name,
                findIconAndName,
                container,
                updateIcon = defaultReplaceIcon,
                updateName = defaultReplaceText,
                update,
              } = wallet;
              try {
                const walletId = getWalletId(provider, updatedName);
                const hasReplaced = !!document.querySelector(`.${walletId}`);
                if (hasReplaced) {
                  continue;
                }
                let result: FindResultType | null = null;
                if (update) {
                  const newIconElement = update(wallet);
                  newIconElement?.classList.add(walletId);
                  continue;
                } else if (findIconAndName) {
                  result = findIconAndName.call(null, wallet);
                } else if (container) {
                  const isSelector = typeof container === 'string';
                  const containerElement: HTMLElement | null = isSelector
                    ? document.querySelector(container)
                    : container();
                  if (!containerElement) {
                    continue;
                  }
                  result = defaultFindIconAndName(containerElement, name);
                }
                if (!result) {
                  universalLog.warn('==>warn: no result found');
                  continue;
                }
                const { textNode, iconNode } = result;
                if (textNode && iconNode) {
                  updateName(textNode, updatedName);
                  const newIconElement = updateIcon(iconNode, updatedIcon);
                  newIconElement.classList.add(walletId);
                  universalLog.log('textNode', textNode);
                  universalLog.log('iconNode', iconNode);
                }
              } catch (e) {
                universalLog.log(e);
              }
            }
          }
        }
      },
    });
  }
}

try {
  hackWalletConnectButton(sitesConfig);
} catch (e) {
  universalLog.warn(e);
}