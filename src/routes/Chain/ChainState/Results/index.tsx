// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainStateResultWrapper, FilterWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { ChainStateResult } from './Result';
import { splitChainStateKey } from 'model/ChainState/util';
import type { StorageType } from 'model/ChainState/types';
import type {
  ChainStateConstants,
  ChainStateSubscriptions,
} from 'contexts/ChainState/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterList } from '@fortawesome/pro-duotone-svg-icons';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';

export const Results = ({
  storageType,
  withSpacer = true,
}: {
  storageType?: StorageType;
  withSpacer?: boolean;
}) => {
  const { tabId } = useActiveTab();
  const { getStorageItemFilter, setStorageItemFilter } = useChainUi();
  const { getChainStateByType, chainStateConstants, getTotalChainStateItems } =
    useChainState();

  const filtered = storageType
    ? getStorageItemFilter(tabId, storageType)
    : false;

  let chainStateItems: ChainStateSubscriptions | ChainStateConstants = {};

  // Include raw and storage results if display allows.
  if (['raw', 'storage', undefined].includes(storageType) || !filtered) {
    chainStateItems = getChainStateByType('raw');
  }

  // Include constant results if display allows.
  if (['constant', undefined].includes(storageType) || !filtered) {
    chainStateItems = {
      ...chainStateItems,
      ...chainStateConstants,
    };
  }

  // If no storageType is given, filter out items that are not pinned.
  const filteredChainStateItems =
    storageType === undefined
      ? Object.fromEntries(
          Object.entries(chainStateItems).filter(([, val]) => val.pinned)
        )
      : chainStateItems;

  // Sort items based on timestamp.
  const sortedChainStateItems: ChainStateSubscriptions | ChainStateConstants =
    Object.fromEntries(
      Object.entries(filteredChainStateItems).sort(([, itemA], [, itemB]) =>
        itemA.timestamp < itemB.timestamp
          ? -1
          : itemA.timestamp > itemB.timestamp
            ? 1
            : 0
      )
    );

  // Gets label associated with storage type.
  const getStorageTypeLabel = () => {
    switch (storageType) {
      case 'constant':
        return 'Constants';
      case 'raw':
        return 'Raw';
      case 'storage':
        return 'Storage';
    }
  };

  return (
    <>
      {getTotalChainStateItems() > 0 && (
        <FilterWrapper className={withSpacer ? 'withSpacer' : undefined}>
          {!!storageType && (
            <button
              className={filtered ? 'active' : ''}
              onClick={() => {
                setStorageItemFilter(tabId, storageType, !filtered);
              }}
            >
              {filtered ? `${getStorageTypeLabel()} Only` : 'Filter'}
              <FontAwesomeIcon icon={faFilterList} />
            </button>
          )}
        </FilterWrapper>
      )}
      <ChainStateResultWrapper>
        {Object.entries(sortedChainStateItems)
          .reverse()
          .map(([key, value]) => {
            const [index, rawKey] = splitChainStateKey(key);
            const { type, result, pinned } = value;

            return (
              <ChainStateResult
                key={`${index}-${rawKey}`}
                chainStateKey={key}
                type={type}
                result={result}
                pinned={pinned}
              />
            );
          })}
      </ChainStateResultWrapper>
    </>
  );
};
