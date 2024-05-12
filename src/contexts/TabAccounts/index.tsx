// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { TabAccountsContextInterface } from './types';
import { defaultTabAccountsContext } from './defaults';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import BigNumber from 'bignumber.js';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useActiveTab } from 'contexts/ActiveTab';
import { defaultBalance, defaultLocks } from 'hooks/useActiveBalances/defaults';
import type { APIChainSpec } from 'model/Api/types';

export const TabAccounts = createContext<TabAccountsContextInterface>(
  defaultTabAccountsContext
);

export const useTabAccounts = () => useContext(TabAccounts);

export const TabAccountsProvider = ({ children }: { children: ReactNode }) => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getAccounts: getImportedAccounts } = useImportedAccounts();
  const { getApiStatus, getChainSpec } = useChainSpaceEnv();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainBrowser')?.instanceId;
  const apiStatus = getApiStatus(apiInstanceId);
  const chainSpec = getChainSpec(apiInstanceId);

  // Get accounts given a chainSpec.
  const getAccounts = (spec?: APIChainSpec) =>
    spec && spec.chain ? getImportedAccounts(spec.chain, spec.ss58Prefix) : [];

  // Get all imported accounts if chain spec is available.
  const accounts =
    chainSpec && chainSpec.chain
      ? getImportedAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  // Instance config to be provided to active balances.
  const activeBalanceInstance = apiInstanceId
    ? {
        [apiInstanceId]: {
          accounts: accounts.map(({ address }) => address),
          apiStatus,
        },
      }
    : {};

  // Get tab account balances and listen for updates.
  const activeBalances = useActiveBalances(activeBalanceInstance);

  // Get balances from `activeBalances` at this api instance id.
  const getBalance = (address: MaybeAddress) =>
    apiInstanceId
      ? activeBalances.getBalance(apiInstanceId, address)
      : defaultBalance;

  // Gets locks from `activeBalances` at this api instance id.
  const getLocks = (address: MaybeAddress) =>
    apiInstanceId
      ? activeBalances.getLocks(apiInstanceId, address)
      : defaultLocks;

  // Gets edReserved from `activeBalances` at this api instance id.
  const getEdReserved = (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ) =>
    apiInstanceId
      ? activeBalances.getEdReserved(apiInstanceId, address, existentialDeposit)
      : new BigNumber(0);

  return (
    <TabAccounts.Provider
      value={{
        getAccounts,
        getBalance,
        getLocks,
        getEdReserved,
        accounts,
      }}
    >
      {children}
    </TabAccounts.Provider>
  );
};
