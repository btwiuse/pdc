// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { defaultChainStateContext } from './defaults';
import type {
  ChainStateConstants,
  ChainStateContextInterface,
  ChainStateSubscriptionEventDetail,
  ChainStateSubscriptions,
} from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { ChainStateController } from 'controllers/ChainState';
import { setStateWithRef } from '@w3ux/utils';
import type {
  ChainStateEventDetail,
  StorageSubscriptionType,
  StorageType,
  SubscriptionEntry,
} from 'model/ChainState/types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import * as local from './Local';
import { useApiIndexer } from 'contexts/ApiIndexer';

export const ChainState = createContext<ChainStateContextInterface>(
  defaultChainStateContext
);

export const useChainState = () => useContext(ChainState);

export const ChainStateProvider = ({ children }: { children: ReactNode }) => {
  const { tabId, ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const apiInstanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;

  // The results of current chain state subscriptions, keyed by subscription key.
  const [chainStateSubscriptions, setChainStateSubscriptionsState] =
    useState<ChainStateSubscriptions>({});
  const chainStateSubscriptionsRef = useRef(chainStateSubscriptions);

  // Sets chain state subscriptions to state, ref and local storage.
  const setChainStateSubscriptions = (value: ChainStateSubscriptions) => {
    local.setChainStateSubscriptions(ownerId, value);
    setStateWithRef(
      value,
      setChainStateSubscriptionsState,
      chainStateSubscriptionsRef
    );
  };

  // The results of current chain state constants, keyed by subscription key.
  const [chainStateConstants, setChainStateConstantsState] =
    useState<ChainStateConstants>({});

  // Sets constants to state and local storage.
  const setChainStateConstants = (value: ChainStateConstants) => {
    local.setChainStateConstants(ownerId, value);
    setChainStateConstantsState(value);
  };

  // Get a chain state subscription by key.
  const getChainStateItem = (key: string) =>
    chainStateSubscriptions?.[key] || null;

  // Set a chain state subscription by key.
  const setChainStateItem = (item: ChainStateSubscriptionEventDetail) => {
    const { key, ...rest } = item;
    const current = chainStateSubscriptionsRef.current[key];

    setChainStateSubscriptions({
      ...chainStateSubscriptionsRef.current,
      [key]: { ...rest, pinned: current?.pinned || item?.pinned || false },
    });
  };

  // Set a new constant for a tab and key.
  const setConstant = (key: string, value: SubscriptionEntry) => {
    const updated = { ...chainStateConstants };
    const current = updated[key];

    updated[key] = { ...value, pinned: current?.pinned || false };
    setChainStateConstants(updated);
  };

  // Get chain state by type.
  const getChainStateByType = (type: StorageSubscriptionType) => {
    // Note that undefined results are also being removed, which could be present as a result of a
    // temporary invalid subscription.
    const filteredEntries = Object.entries(chainStateSubscriptions).filter(
      ([, subscription]) =>
        subscription.type === type && subscription.result !== undefined
    );
    return Object.fromEntries(filteredEntries);
  };

  // Remove a subscription from chain state.
  const removeChainStateItem = (type: StorageType, key: string) => {
    if (!apiInstanceId) {
      return;
    }

    // Handle removal of chain state subscription.
    if (['storage', 'raw'].includes(type)) {
      // Remove key and unsubscribe from controller.
      ChainStateController.instances?.[apiInstanceId]?.unsubscribeOne(key);
      // Remove key from context chain state.
      const updatedChainState = { ...chainStateSubscriptions };
      delete updatedChainState[key];

      setChainStateSubscriptions(updatedChainState);
    }

    // Handle removal of chain state constant.
    if (type === 'constant') {
      const updated = { ...chainStateConstants };
      delete updated[key];
      setChainStateConstants(updated);
      ChainStateController.instances?.[apiInstanceId].removeConstant(key);
    }
  };

  // Get total result items.
  const getTotalChainStateItems = () =>
    Object.keys(chainStateSubscriptions).length +
    Object.keys(chainStateConstants).length;

  // Get total items that are pinned.
  const getTotalPinnedItems = () =>
    Object.values(chainStateSubscriptions).filter(({ pinned }) => pinned)
      .length +
    Object.values(chainStateConstants).filter(({ pinned }) => pinned).length;

  // Store chain state subscription results as they are received.
  const handleNewChainState = (e: Event) => {
    if (isCustomEvent(e)) {
      const {
        ownerId: detailOwnerId,
        instanceId,
        ...rest
      }: ChainStateEventDetail = e.detail;

      if (ownerId === detailOwnerId && apiInstanceId === instanceId) {
        setChainStateItem(rest);
      }
    }
  };

  const documentRef = useRef(document);
  useEventListener(
    'callback-new-chain-state-subscription',
    handleNewChainState,
    documentRef
  );

  // Set pinned for a chain state item.
  const setItemPinned = (
    type: StorageType,
    subscriptionKey: string,
    pinned: boolean
  ) => {
    const entries =
      type === 'constant'
        ? { ...chainStateConstants }
        : { ...chainStateSubscriptions };

    const updated = Object.fromEntries(
      Object.entries(entries).map(([key, value]) =>
        subscriptionKey === key
          ? [
              key,
              {
                ...value,
                pinned,
              },
            ]
          : [key, value]
      )
    );

    if (type === 'constant') {
      setChainStateConstants(updated as ChainStateConstants);
    } else {
      setChainStateSubscriptions(updated as ChainStateSubscriptions);
    }
  };

  // Get chain state on tab change.
  useEffectIgnoreInitial(() => {
    if (!apiInstanceId) {
      return;
    }

    setChainStateSubscriptions(
      ChainStateController.getSubscriptions(apiInstanceId)
    );
    setChainStateConstants(ChainStateController.getConstants(apiInstanceId));
  }, [tabId]);

  return (
    <ChainState.Provider
      value={{
        getChainStateByType,
        getChainStateItem,
        removeChainStateItem,
        chainStateConstants,
        getTotalChainStateItems,
        setConstant,
        setItemPinned,
        getTotalPinnedItems,
      }}
    >
      {children}
    </ChainState.Provider>
  );
};
