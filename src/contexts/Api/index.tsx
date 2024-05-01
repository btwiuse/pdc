// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  ApiInstanceId,
  ApiStatus,
  ApiStatusState,
  ChainSpecState,
  ErrDetail,
  OwnerId,
} from 'model/Api/types';
import { useChainUi } from 'contexts/ChainUi';
import { NotificationsController } from 'controllers/Notifications';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/BlockNumber';
import { AccountBalances } from 'model/AccountBalances';
import { setStateWithRef } from '@w3ux/utils';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';
import { getIndexFromInstanceId } from 'model/Api/util';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { fetchPalletVersions } = useChainUi();
  const { tabs, forgetTabChain, instantiateApiFromTab, setTabForceDisconnect } =
    useTabs();

  // Store API connection status of each api instance. NOTE: requires ref as it is used in event
  // listener.
  const [apiStatus, setApiStatusState] = useState<ApiStatusState>({});
  const apiStatusRef = useRef(apiStatus);

  // Setter for api status. Updates state and ref.
  const setApiStatus = (newApiStatus: ApiStatusState) => {
    setStateWithRef(newApiStatus, setApiStatusState, apiStatusRef);
  };

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpecState] = useState<ChainSpecState>({});
  const chainSpecRef = useRef(chainSpec);

  // Setter for chain spec. Updates state and ref.
  const setChainSpec = (newChainSpec: ChainSpecState) => {
    setStateWithRef(newChainSpec, setChainSpecState, chainSpecRef);
  };

  // Remove api status for an owner.
  const removeApiStatus = (ownerId: OwnerId) => {
    const updated = { ...apiStatusRef.current };
    delete updated[ownerId];
    setApiStatus(updated);
  };

  // Remove chain spec for an owner.
  const removeChainSpec = (instanceId: ApiInstanceId) => {
    const updated = { ...chainSpecRef.current };
    delete updated[instanceId];
    setChainSpec(updated);
  };

  // Gets an api status, keyed by owner.
  const getApiStatus = (ownerId: OwnerId): ApiStatus => apiStatus[ownerId];

  // Gets whether an api is active (not disconnected or undefined).
  const getApiActive = (ownerId: OwnerId): boolean => {
    const status = getApiStatus(ownerId);
    return (
      status === 'ready' || status === 'connected' || status === 'connecting'
    );
  };

  // Gets a chain spec, keyed by owner.
  const getChainSpec = (instanceId: ApiInstanceId): APIChainSpec =>
    chainSpec[instanceId];

  // Handle a chain disconnect.
  const handleDisconnect = (
    ownerId: OwnerId,
    instanceId: ApiInstanceId,
    destroy = false
  ) => {
    if (destroy) {
      removeApiStatus(ownerId);
      removeChainSpec(instanceId);
    } else {
      // Update API status to `disconnected`.
      setApiStatus({ ...apiStatusRef.current, [ownerId]: 'disconnected' });
    }
  };

  // Handle a chain error.
  const handleChainError = (
    ownerId: OwnerId,
    instanceId: ApiInstanceId,
    err?: ErrDetail
  ) => {
    removeApiStatus(ownerId);
    removeChainSpec(instanceId);

    // If the error originated from initialization or bootstrapping of metadata, assume the
    // connection is an invalid chain and forget it. This prevents auto connect on subsequent
    // visits.
    if (err && ['InitializationError', 'ChainSpecError'].includes(err)) {
      // If this owner is a tab, disconnect and forget the chain.
      if (ownerId.startsWith('tab_')) {
        forgetTabChain(ownerIdToTabId(ownerId));
        setTabForceDisconnect(ownerIdToTabId(ownerId), true);
      }
      NotificationsController.emit({
        title: 'Error Initializing Chain',
        subtitle: `Failed to initialize the chain.`,
      });
    }
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event, err } =
        e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [ownerId]: 'ready',
          });

          // Initialise subscriptions for Overview here. We are currently only subscribing to the
          // block number. NOTE: SubscriptionsController is currently only assuming one `chainId`
          // per owner. This needs to change for parachain setup. TODO: SubscriptionsController to
          // handle multiple chainIds for owners.
          SubscriptionsController.set(
            instanceId,
            'blockNumber',
            new BlockNumber(ownerId, instanceId, chainId)
          );

          // Initialise account balance subscriptions.
          SubscriptionsController.set(
            instanceId,
            'accountBalances',
            new AccountBalances(ownerId, instanceId, chainId)
          );

          break;
        case 'connecting':
          setApiStatus({ ...apiStatusRef.current, [ownerId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [ownerId]: 'connected' });
          break;
        case 'disconnected':
          handleDisconnect(ownerId, instanceId);
          break;
        case 'error':
          handleChainError(ownerId, instanceId, err);
          break;
        case 'destroyed':
          handleDisconnect(ownerId, instanceId, true);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, spec, consts } = e.detail;

      setChainSpec({
        ...chainSpecRef.current,
        [instanceId]: { ...spec, consts },
      });

      // Fetch pallet versions for ChainUi state.
      fetchPalletVersions(
        ownerId,
        spec.metadata,
        ApiController.getInstance(ownerId, getIndexFromInstanceId(instanceId))
      );
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Initialisation of Api.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return (
    <Api.Provider
      value={{
        getApiStatus,
        getApiActive,
        getChainSpec,
      }}
    >
      {children}
    </Api.Provider>
  );
};
