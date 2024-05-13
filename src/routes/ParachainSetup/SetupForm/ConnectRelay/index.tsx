// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { Select } from 'library/Inputs/Select';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftToBracket } from '@fortawesome/pro-duotone-svg-icons';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { faCheckCircle } from '@fortawesome/sharp-regular-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useApiIndexer } from 'contexts/ApiIndexer';

export const ConnectRelay = () => {
  const { setTabActiveTask } = useTabs();
  const { tabId, ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getConfirmedRelayChain } = useParaSetup();
  const { getApiStatus, getChainSpec, destroyAllApiInstances } =
    useChainSpaceEnv();

  const relayChain = getConfirmedRelayChain(tabId);

  // Get API instance data.
  const instanceId = getTabApiIndex(
    ownerId,
    'parachainSetup:relay'
  )?.instanceId;

  const apiStatus = getApiStatus(instanceId);
  const chainSpec = getChainSpec(instanceId);

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain.isRelayChain
  );

  // Get chain icons dervied from relay chain keys.
  const icon = relayChains
    .map(([chainId]) => chainId)
    .filter((chainId) => chainId === relayChain)[0];

  // Get the chain name of the currently select relay chain.
  const relayName =
    relayChains.find(([chainId]) => chainId === relayChain)?.[1]?.name ||
    'Polkadot Relay Chain';

  // API can be assumed as valid when it is ready and the chain spec has been fetched.
  const apiValid = ['ready'].includes(apiStatus) && chainSpec !== undefined;

  // Handle disconnect from api instance. This will destroy the api instance and reset the tab
  // active task.
  const handleDisconnect = () => {
    if (instanceId !== undefined) {
      // Destroy the API instance.
      destroyAllApiInstances(ownerId);

      // Reset tab active task.
      setTabActiveTask(tabId, null);
    }
  };

  return (
    <FormWrapper>
      <h3>Selected Relay Chain:</h3>

      <section>
        <Select
          values={[relayName]}
          icons={[icon]}
          value={relayName}
          onChange={() => {
            /* Do nothing: permanently disabled. */
          }}
          disabled={true}
        />
      </section>
      <section>
        {!apiValid ? (
          <h4 className="note">Connecting to {relayName}...</h4>
        ) : (
          <h4 className="note">
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform="grow-1"
              className="icon"
            />
            Connected to {relayName}. Ready to reserve a Para ID.
          </h4>
        )}

        <ButtonSubmit
          className="lg"
          onClick={() => {
            if (apiStatus !== 'ready') {
              handleDisconnect();
            } else {
              if (
                confirm(
                  'Are you sure you want to disconnect? This will reset your setup progress.'
                )
              ) {
                handleDisconnect();
              }
            }
          }}
        >
          <>
            <FontAwesomeIcon icon={faArrowLeftToBracket} className="iconLeft" />
            {apiValid ? 'Disconnect & Cancel Setup' : 'Cancel Connect'}
          </>
        </ButtonSubmit>
      </section>
    </FormWrapper>
  );
};
