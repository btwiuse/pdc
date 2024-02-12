// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Tabs, TabsContextInterface } from './types';
import { defaultTabs, defaultTabsContext } from './defaults';

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Connect to the Polkadot Relay chain (first tab).

  // Created tabs.
  const [tabs, setTabs] = useState<Tabs>(defaultTabs);

  // Currently active tab.
  const [activeTabId, setActiveTabId] = useState<number>(1);

  // Currently active tab index.
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);

  // Gets the active tab.
  const getActiveTab = () => tabs.find((tab) => tab.id === activeTabId);

  // Gets the currently hovered tab.
  const [tabHoverIndex, setTabHoverIndex] = useState<number>(0);

  // Create a new tab.
  const createTab = () => {
    const newTabId = tabs.length + 1;
    const newTab = {
      id: newTabId,
      chain: undefined,
      name: 'New Tab',
    };

    const newTabs = [...tabs, newTab];

    setTabs(newTabs);
    setActiveTabId(newTabId);
    setActiveTabIndex(newTabs.length);
  };

  // Removes a tab from state.
  const destroyTab = (index: number, id: number) => {
    const newTabs = [...tabs].filter((t) => t.id !== id);

    setTabs(newTabs);
    if (id === activeTabId) {
      setActiveTabId(1);
      setActiveTabIndex(0);
    }

    if (activeTabIndex > index) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        setTabs,
        createTab,
        activeTabId,
        getActiveTab,
        destroyTab,
        setActiveTabId,
        tabHoverIndex,
        setTabHoverIndex,
        activeTabIndex,
        setActiveTabIndex,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
