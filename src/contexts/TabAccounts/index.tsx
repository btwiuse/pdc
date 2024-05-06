// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type {
  AccountBalancesState,
  TabAccountsContextInterface,
  BalanceLocks,
} from './types';
import { defaultTabAccountsContext } from './defaults';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { useApi } from 'contexts/Api';
import type { AccountBalances } from 'model/AccountBalances';
import type { BalanceLock } from 'model/AccountBalances/types';
import BigNumber from 'bignumber.js';
import { useActiveTab } from 'contexts/ActiveTab';
import { useImportedAccounts } from 'contexts/ImportedAccounts';

export const TabAccounts = createContext<TabAccountsContextInterface>(
  defaultTabAccountsContext
);

export const useTabAccounts = () => useContext(TabAccounts);

export const TabAccountsProvider = ({ children }: { children: ReactNode }) => {
  const { getAccounts } = useImportedAccounts();
  const { getChainSpec, getApiStatus } = useApi();
  const { tabId, ownerId, apiInstanceId } = useActiveTab();

  const apiStatus = getApiStatus(apiInstanceId);
  const chainSpec = getChainSpec(apiInstanceId);

  // Get all imported accounts if chain spec is available.
  const accounts =
    chainSpec && chainSpec.chain
      ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  // The currently persisted account balances.
  const [accountBalances, setAccountBalancesState] =
    useState<AccountBalancesState>({});
  const accountBalancesRef = useRef(accountBalances);

  // Setter for active balances.
  const setActiveBalances = (balances: AccountBalancesState) => {
    accountBalancesRef.current = balances;
    setAccountBalancesState(balances);
  };

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalanceCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { ownerId: eventOwnerId, instanceId, address, balance } = e.detail;
      if (eventOwnerId !== ownerId && instanceId === apiInstanceId) {
        return;
      }

      // Update state of active accounts.
      setActiveBalances({
        ...accountBalancesRef.current,
        [address]: balance,
      });
    }
  };

  // Get account balance for a specific account.
  const getAccountBalance = (address: string) => accountBalances[address];

  const handleSyncAccounts = () => {
    const subscription = SubscriptionsController?.get(
      apiInstanceId,
      'accountBalances'
    );
    if (subscription) {
      const newAccounts = accounts.map(({ address }) => address);
      (subscription as AccountBalances).syncAccounts(newAccounts);
    }
  };

  // Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
  const getMaxLock = (locks: BalanceLock[]): BigNumber =>
    locks.reduce(
      (prev, current) =>
        prev.amount.isGreaterThan(current.amount) ? prev : current,
      { amount: new BigNumber(0) }
    )?.amount || new BigNumber(0);

  // Gets an account's balance's locks.
  const getBalanceLocks = (address: string | undefined): BalanceLocks => {
    if (address) {
      const maybeLocks = accountBalances[address]?.locks;
      if (maybeLocks) {
        return { locks: maybeLocks, maxLock: getMaxLock(maybeLocks) };
      }
    }

    return {
      locks: [],
      maxLock: new BigNumber(0),
    };
  };

  // Gets the amount of balance reserved for existential deposit.
  const getEdReserved = (
    address: string | undefined,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const { locks, maxLock } = getBalanceLocks(address);
    if (address && locks) {
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Sync account balances on imported accounts update or tab change. `api` instance is required in
  // subscription classes so api must be `ready` before syncing.
  useEffect(() => {
    setActiveBalances(
      (
        SubscriptionsController?.get(
          apiInstanceId,
          'accountBalances'
        ) as AccountBalances
      )?.balances || {}
    );

    if (apiStatus === 'ready') {
      handleSyncAccounts();
    }
  }, [
    tabId,
    apiStatus === 'ready',
    JSON.stringify(accounts.map(({ address }) => address)),
  ]);

  // Listen for new account balance events.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'callback-account-balance',
    newAccountBalanceCallback,
    documentRef
  );

  return (
    <TabAccounts.Provider
      value={{ getAccountBalance, getBalanceLocks, getEdReserved, accounts }}
    >
      {children}
    </TabAccounts.Provider>
  );
};
