// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  ConnectFrom,
  TabTask,
  Tabs,
  TabsContextInterface,
  TaskData,
} from './types';
import {
  TASK_HOME_PAGE_INDEXES,
  defaultTabs,
  defaultTabsContext,
} from './defaults';
import * as local from './Local';
import { useSettings } from 'contexts/Settings';
import { checkLocalTabs } from 'IntegrityChecks/Local';
import type { Route } from 'App';

checkLocalTabs();

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const { autoConnect } = useSettings();

  // Created tabs. NOTE: Requires ref as it is used in event listeners.
  const [tabs, setTabsState] = useState<Tabs>(local.getTabs() || defaultTabs);
  const tabsRef = useRef(tabs);

  // Current active tab id.
  const [selectedTabId, setSelectedTabIdState] = useState<number>(
    local.getSelectedTabId() || 1
  );

  // Current active tab index.
  const [activeTabIndex, setSelectedTabIndexState] = useState<number>(
    local.getActiveTabIndex() || 1
  );

  // Current hovered tab index.
  const [tabHoverIndex, setTabHoverIndex] = useState<number>(-1);

  // Current drag tab index.
  const [dragId, setDragId] = useState<number | null>(null);

  // Instantiated tab ids.
  const instantiatedIds = useRef<number[]>([]);

  // Redirect counter to trigger redirect effects.
  const [redirectCounter, setRedirectCounter] = useState<number>(0);

  // Increment redirect counter.
  const incrementRedirectCounter = () => {
    setRedirectCounter(redirectCounter + 1);
  };

  // Adds an id to instantiated tabs.
  const addInstantiatedId = (index: number) => {
    instantiatedIds.current = [
      ...new Set(instantiatedIds.current.concat(index)),
    ];
  };

  // Sets tabs state, and updates local storage.
  const setTabs = (newTabs: Tabs) => {
    local.setTabs(newTabs);
    tabsRef.current = newTabs;
    setTabsState(newTabs);
  };

  // Sets selected tab id, and updates local storage.
  const setSelectedTabId = (id: number) => {
    local.setActiveTabId(id);
    setSelectedTabIdState(id);
  };

  // Sets active tab index, and updates local storage.
  const setSelectedTabIndex = (index: number) => {
    local.setSelectedTabIndex(index);
    setSelectedTabIndexState(index);
  };

  // Remove an id from destroying tabs.
  const removeInstantiatedId = (id: number) => {
    instantiatedIds.current = instantiatedIds.current.filter(
      (item) => item !== id
    );
  };

  // Gets a tab by its id.
  const getTab = (tabId: number) => tabs.find((tab) => tab.id === tabId);

  // Get the largest id from a list of tabs.
  const getLargestId = (list: Tabs) =>
    [...list].sort((a, b) => b.id - a.id)?.[0].id || 0;

  // Creates a new tab and makes it active.
  const createTab = () => {
    // NOTE: The new tab ID is determined by getting the largest existing id and incrementing it.
    // This ensures that the new tab ID is unique. Tab IDs do not represent order.
    const newTabId = getLargestId(tabs) + 1;

    const newTabs = [
      ...tabs,
      {
        id: newTabId,
        name: 'New Tab',
        activeTask: null,
        taskData: undefined,
        ui: {
          activeConnectFrom: 'directory' as ConnectFrom,
          autoConnect,
        },
        activePage: 0,
      },
    ];

    setTabs(newTabs);
    setSelectedTabId(newTabId);
    setSelectedTabIndex(newTabs.length - 1);
  };

  // Removes a tab from state.
  const destroyTab = (index: number, id: number) => {
    // Remove instantiated id.
    removeInstantiatedId(id);

    // Remove destroyed tab from state.
    const newTabs = [...tabs].filter((t) => t.id !== id);
    setTabs(newTabs);

    // If the active tab is being closed, fall back to its previous tab.
    if (id === selectedTabId) {
      setSelectedTabId(Object.values(newTabs)[Math.max(index - 1, 0)]?.id);
      setSelectedTabIndex(Math.max(index - 1, 0));
    }
    // Re-sync the active tab index if the destroyed tab was in front of it.
    if (activeTabIndex > index) {
      setSelectedTabIndex(activeTabIndex - 1);
    }

    // Remove this tab's activePages from local storage.
    local.removeTabActivePages(id);
  };

  // Rename a tab.
  const renameTab = (id: number, name: string) => {
    const newTabs = tabsRef.current.map((tab) =>
      tab.id === id ? { ...tab, name } : tab
    );
    setTabs(newTabs);
  };

  // Generate auto tab name.
  const getAutoTabName = (id: number, startsWith: string) => {
    // If tab already starts with the provided string, return it.
    const currentName = getTab(id)?.name || '';
    if (currentName.startsWith(startsWith)) {
      return currentName;
    }

    const tabsStartingWith = tabs.filter((tab) =>
      tab.name.startsWith(startsWith)
    ).length;

    const tabName =
      tabsStartingWith === 0
        ? startsWith
        : `${startsWith} ${tabsStartingWith + 1}`;

    return tabName;
  };

  // Set a tab's autoConnect setting.
  const setTabAutoConnect = (id: number, checked: boolean) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === id) {
        const updated = { ...tab };
        updated.ui.autoConnect = checked;

        if (updated.taskData) {
          updated.taskData.autoConnect = checked;
        }
        return updated;
      } else {
        return tab;
      }
    });
    setTabs(newTabs);
  };

  // Set a tab's active page. NOTE: This function is called indirectly from within event listeners,
  // so tabsRef is used to ensure the latest tabs config is used.
  const setTabActivePage = (
    tabId: number,
    route: Route,
    activePage: number,
    persist = true
  ) => {
    if (persist) {
      local.setActivePage(tabId, route, activePage);
    }

    setTabs(
      tabsRef.current.map((tab) => {
        if (tab.id === tabId) {
          return {
            ...tab,
            activePage,
          };
        }
        return tab;
      })
    );
  };

  // Update `activeConnectFrom` in tab's ui property.
  const setTabConnectFrom = (id: number, connectFrom: ConnectFrom) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === id) {
        const updated = { ...tab };
        updated.ui.activeConnectFrom = connectFrom;
        return updated;
      } else {
        return tab;
      }
    });
    setTabs(newTabs);
  };

  // Switch tab.
  const switchTab = (tabId: number, tabIndex: number) => {
    const localActivePage = local.getActivePage(tabId, 'default');

    if (localActivePage !== undefined) {
      setTabActivePage(tabId, 'default', localActivePage, false);
    }
    setSelectedTabId(tabId);
    setSelectedTabIndex(tabIndex);
  };

  // Get an active task for a tab.
  const getTabActiveTask = (tabId: number) => getTab(tabId)?.activeTask || null;

  // Set an active task for a tab. NOTE: This function is called within event listeners, so tabsRef
  // is used to ensure the latest tabs config is used.
  const setTabActiveTask = (tabId: number, task: TabTask | null) => {
    const newTabs = tabsRef.current.map((tab) =>
      tab.id === tabId ? { ...tab, activeTask: task } : tab
    );
    setTabs(newTabs);
  };

  // Reset a tab task to null. The previously used task is provided to set the correct active home
  // page index.
  const resetTabActiveTask = (tabId: number) => {
    const currentTask = getTabActiveTask(tabId);
    const homePageIndex = currentTask ? TASK_HOME_PAGE_INDEXES[currentTask] : 0;
    local.setActivePage(tabId, 'default', homePageIndex);
    setTabActiveTask(tabId, null);
  };

  // Get at tab's taskData, if any.
  const getTabTaskData = (tabId: number) => getTab(tabId)?.taskData;

  // Set a tab's `taskData` property.
  const setTabTaskData = (tabId: number, value: TaskData) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === tabId) {
        const updated = { ...tab };
        updated.taskData = value;
        return updated;
      }
      return tab;
    });
    setTabs(newTabs);
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        tabsRef: tabsRef.current,
        setTabs,
        createTab,
        selectedTabId,
        getTab,
        destroyTab,
        setSelectedTabId,
        tabHoverIndex,
        setTabHoverIndex,
        activeTabIndex,
        setSelectedTabIndex,
        addInstantiatedId,
        setDragId,
        dragId,
        renameTab,
        getAutoTabName,
        redirectCounter,
        incrementRedirectCounter,
        setTabAutoConnect,
        setTabActivePage,
        switchTab,
        getTabActiveTask,
        setTabActiveTask,
        resetTabActiveTask,
        getTabTaskData,
        setTabTaskData,
        setTabConnectFrom,
        instantiatedIds: instantiatedIds.current,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
