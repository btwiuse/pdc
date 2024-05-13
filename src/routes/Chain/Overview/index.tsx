// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { isDirectoryId } from 'config/networks/Utils';
import { CardsWrapper } from './Wrappers';
import ConnectedSVG from 'svg/Connected.svg?react';
import Odometer from '@w3ux/react-odometer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHive } from '@fortawesome/free-brands-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { useActiveTab } from 'contexts/ActiveTab';
import { isCustomEvent } from 'Utils';
import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';
import { StatsWrapper } from '../Wrappers';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { BlockNumber } from 'model/BlockNumber';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';

export const Overview = () => {
  const { getTabApiIndex } = useApiIndexer();
  const { tab, tabId, ownerId } = useActiveTab();
  const { getApiStatus, getChainSpec } = useChainSpaceEnv();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;
  const apiStatus = getApiStatus(apiInstanceId);
  const chainSpec = getChainSpec(apiInstanceId);
  const chainSpecReady = !!chainSpec;

  // NOTE: we know for certain there is an active tab and an associated API instance here, so we can
  // safely use the non-null assertion.
  const chainId = tab!.taskData!.chain!.id;

  const isDirectory = isDirectoryId(chainId);
  const chainSpecChain = chainSpec?.chain || 'Unknown';

  // Determine chain name based on chain spec.
  let displayName;
  if (isDirectory) {
    // Display directory name if the chain name matches that of directory.
    const match = NetworkDirectory[chainId].system?.chain === chainSpec?.chain;
    displayName = match ? NetworkDirectory[chainId].name : chainSpecChain;
  } else {
    // Custom endpoint: Default to chain spec chain name or 'Unknown' otherwise.
    displayName = chainSpecChain;
  }

  // Whether this component is still syncing.
  const syncing = !chainSpecReady;

  // The latest received block number.
  const [blockNumber, setBlockNumber] = useState<string>(
    apiInstanceId
      ? (
          SubscriptionsController.get(
            apiInstanceId,
            'blockNumber'
          ) as BlockNumber
        )?.blockNumber || '0'
      : '0'
  );

  // Handle new block number callback.
  const newBlockCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { ownerId: eventOwnerId, instanceId } = e.detail;

      if (eventOwnerId === ownerId && instanceId === apiInstanceId) {
        setBlockNumber(e.detail.blockNumber);
      }
    }
  };

  // Listen for block number updates.
  const ref = useRef<Document>(document);
  useEventListener('callback-block-number', newBlockCallback, ref);

  // Update block number on tab change.
  useEffect(() => {
    setBlockNumber(
      apiInstanceId
        ? (
            SubscriptionsController.get(
              apiInstanceId,
              'blockNumber'
            ) as BlockNumber
          )?.blockNumber || '0'
        : '0'
    );
  }, [tabId]);

  return (
    <FlexWrapper>
      <h2>
        {!chainSpecReady && apiStatus === 'connecting'
          ? 'Connecting...'
          : chainSpecReady
            ? displayName
            : 'Fetching Chain Spec...'}
      </h2>

      <StatsWrapper className="vSpace">
        <div className={`active${syncing ? ` shimmer` : ``}`}>
          <ConnectedSVG className="icon" />{' '}
          {apiStatus === 'connecting'
            ? 'Connecting...'
            : chainSpecReady
              ? `Connected to ${chainSpec.chain}`
              : 'Loading ...'}
        </div>
        {chainSpecReady ? (
          <>
            <div>
              <span>Spec Name:</span>
              {chainSpec.version.specName}
            </div>
            <div>
              <span>Runtime Version:</span>
              {chainSpec.version.specVersion}
            </div>
          </>
        ) : (
          ''
        )}
      </StatsWrapper>
      <CardsWrapper>
        <section>
          <div className="inner">
            <h4>
              <FontAwesomeIcon icon={faHive} transform="shrink-3" />
              Latest Block
            </h4>
            <h3 className={chainSpecReady ? undefined : 'shimmer syncing'}>
              <Odometer value={new BigNumber(blockNumber || 0).toFormat()} />
            </h3>
          </div>
        </section>
        <section>
          <div className="inner">
            <h4>
              <FontAwesomeIcon icon={faList} transform="shrink-3" /> Runtime
              Snapshot
            </h4>
            <h3>...</h3>
          </div>
        </section>
      </CardsWrapper>
    </FlexWrapper>
  );
};
