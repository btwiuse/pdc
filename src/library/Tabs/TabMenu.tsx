// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faBarsProgress,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useMenu } from 'contexts/Menu';
import { useSettings } from 'contexts/Settings';
import { useTabs } from 'contexts/Tabs';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabContextMenu = ({
  tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => {
  const { closeMenu } = useMenu();
  const { autoTabNaming } = useSettings();
  const { getApiStatus, destroyAllApiInstances, instantiateApiFromTab } =
    useChainSpaceEnv();
  const { getTab, setTabActiveTask, renameTab, getAutoTabName } = useTabs();

  const tab = getTab(tabId);
  const ownerId = tabIdToOwnerId(tabId);
  const apiStatus = getApiStatus(`${ownerId}_0`);

  const apiStatusActive = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canDisconenct = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canReconnect =
    !!tab?.taskData?.chain?.id && !canDisconenct && !apiStatusActive;

  const apiStatusText = canDisconenct
    ? 'Disconnect'
    : apiStatus === 'connecting'
      ? 'Connecting..'
      : canReconnect
        ? 'Reconnect'
        : 'Not Connected';

  const apiButtonInactive = apiStatusActive || canReconnect;

  return (
    <SelectListWrapper>
      <ListWrapper>
        <li>
          <button onClick={() => onSettings()}></button>
          <div className="inner">
            <div>
              <FontAwesomeIcon icon={faBarsProgress} transform="shrink-2" />
            </div>
            <div>
              <h3>Manage Tab</h3>
            </div>
            <div></div>
          </div>
        </li>
      </ListWrapper>
      <h5 className="inline">API</h5>
      <ListWrapper>
        <li className={`${apiButtonInactive ? `` : ` inactive`}`}>
          <button
            onClick={() => {
              if (canDisconenct) {
                destroyAllApiInstances(ownerId);
                // Reset tab name if auto naming is enabled.
                if (autoTabNaming) {
                  renameTab(tabId, getAutoTabName(tabId, 'New Tab'));
                }
              } else if (canReconnect) {
                instantiateApiFromTab(tabId);
                // Update tab task.
                setTabActiveTask(tabId, 'chainExplorer');
              }
              closeMenu();
            }}
          ></button>
          <div className="inner">
            <div
              className={!canDisconenct && !canReconnect ? 'none' : undefined}
            >
              {canDisconenct && (
                <FontAwesomeIcon icon={faLinkSlash} transform="shrink-4" />
              )}
              {canReconnect && (
                <FontAwesomeIcon icon={faLink} transform="shrink-3" />
              )}
            </div>
            <div>
              <h3 className={apiButtonInactive ? undefined : 'inactive'}>
                {apiStatusText}
              </h3>
            </div>
            <div></div>
          </div>
        </li>
      </ListWrapper>
    </SelectListWrapper>
  );
};
