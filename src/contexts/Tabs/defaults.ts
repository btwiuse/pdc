// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tab, Tabs, TabsContextInterface } from './types';

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
  setTabs: (tabs) => {},
  activeTabId: 0,
  setActiveTabId: (id) => {},
  createTab: () => {},
  destroyTab: (index, id) => {},
  getChainTab: (chainId) => undefined,
  getActiveTab: () => undefined,
  tabHoverIndex: 0,
  setTabHoverIndex: (id) => {},
  activeTabIndex: 0,
  setActiveTabIndex: (index) => {},
  addInstantiatedId: (id) => {},
  dragId: null,
  setDragId: (index) => {},
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  instantiatedIds: [],
  renameTab: (id, name) => {},
};

export const DEFAULT_TAB_WIDTH_PX = 145;

export const TAB_TRANSITION_DURATION_MS = 300;

// TODO: derive this default value from `NetworkDirectory`.
export const defaultTabs: Tabs = [
  {
    id: 1,
    chain: {
      id: 'polkadot-relay-chain',
      provider: 'IBP-GeoDNS1',
    },
    name: 'Polkadot Relay',
    autoConnect: true,
  },
  {
    id: 2,
    chain: {
      id: 'kusama-relay-chain',
      provider: 'IBP-GeoDNS1',
    },
    name: 'Kusama Relay',
    autoConnect: false,
  },
  {
    id: 3,
    chain: {
      id: 'westend-relay-chain',
      provider: 'IBP-GeoDNS1',
    },
    name: 'Westend Relay',
    autoConnect: false,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  chain: undefined,
  name: '',
  autoConnect: false,
};
