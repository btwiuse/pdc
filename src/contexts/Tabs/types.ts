// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { ChainId } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

// The tasks that developer console supports.
export type TabTask = 'chainBrowser' | 'parachainSetup';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  name: string;
  activeTask: TabTask | null;
  taskData: TaskData;
  ui: {
    activeConnectFrom: ConnectFrom;
    autoConnect: boolean;
  };
  activePage: number;
}

export type TaskData = taskDatachainBrowser | undefined;

export interface taskDatachainBrowser {
  chain: TabChainData | undefined;
  connectFrom: ConnectFrom;
  autoConnect: boolean;
}

export interface TabChainData {
  id: ChainId;
  endpoint: string;
  ss58: number;
  units: number;
  unit: string;
  api: {
    instanceIndex: number;
  };
}

export interface ChainMeta {
  ss58: number;
  units: number;
  unit: string;
}

export type ConnectFrom = 'directory' | 'customEndpoint';

export interface TabsContextInterface {
  tabs: Tabs;
  tabsRef: Tabs;
  setTabs: (tabs: Tabs) => void;
  createTab: () => void;
  selectedTabId: number;
  getTab: (id: number) => Tab | undefined;
  getActiveTab: () => Tab | undefined;
  destroyTab: (index: number, id: number) => void;
  setSelectedTabId: (index: number) => void;
  tabHoverIndex: number;
  setTabHoverIndex: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  addInstantiatedId: (id: number) => void;
  setDragId: Dispatch<SetStateAction<number | null>>;
  dragId: number | null;
  tabsHidden: boolean;
  setTabsHidden: (hidden: boolean) => void;
  instantiatedIds: number[];
  renameTab: (id: number, name: string) => void;
  redirectCounter: number;
  incrementRedirectCounter: () => void;
  setTabAutoConnect: (id: number, autoConnect: boolean) => void;
  setTabActivePage: (
    id: number,
    route: Route,
    activePage: number,
    persist?: boolean
  ) => void;
  switchTab: (tabId: number, tabIndex: number) => void;
  getTabActiveTask: (tabId: number) => TabTask | null;
  setTabActiveTask: (tabId: number, task: TabTask | null) => void;
  getTabTaskData: (tabId: number) => TaskData;
}

// Active pages structure used in local storage to keep track of active page indexes for each tab.

export type TabsActivePages = Record<string, TabActivePages> | undefined;

export interface TabActivePages {
  default?: number;
  settings?: number;
}
