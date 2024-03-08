import {
  faBarsProgress,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useMenu } from 'contexts/Menu';
import { useTabs } from 'contexts/Tabs';
import { ApiController } from 'controllers/ApiController';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

export const TabMenu = ({
  tabId,
  onSettings,
}: {
  tabId: number;
  onSettings: () => void;
}) => {
  const { closeMenu } = useMenu();
  const { getApiStatus } = useApi();
  const { getTab, instantiateApiFromTab } = useTabs();

  const tab = getTab(tabId);
  const apiStatus = getApiStatus(tabId);

  const apiStatusActive = ['ready', 'connected', 'connecting'].includes(
    apiStatus
  );
  const canDisconenct = ['ready', 'connected'].includes(apiStatus);
  const canReconnect = !!tab?.chain?.id && !canDisconenct && !apiStatusActive;

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
                ApiController.destroy(tabId);
                closeMenu();
              } else if (canReconnect) {
                instantiateApiFromTab(tabId);
                closeMenu();
              }
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