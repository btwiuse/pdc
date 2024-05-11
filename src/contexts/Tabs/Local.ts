// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { Tabs } from './types';
import type { Route } from 'App';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved active tabs from local storage, or returns undefined otherwise.
export const getTabs = (): Tabs | undefined => {
  const result = localStorageOrDefault('activeTabs', undefined, true) as
    | Tabs
    | undefined;

  if (result) {
    try {
      const formatted = result.map((tab) => {
        const autoConnect = tab?.autoConnect || false;

        return {
          ...tab,
          // If this tab is configured to auto-connect, set the active task to connectChain
          // immediately.
          activeTask: autoConnect ? 'connectChain' : tab.activeTask,
          activePage: getActivePage(tab.id, 'default', false),
        };
      });

      return formatted as Tabs;
    } catch (e) {
      // Silently fail.
    }
  }
  return undefined;
};

// Gets the active tab id from local storage, or returns undefined otherwise.
export const getSelectedTabId = (): number | undefined => {
  const result = localStorageOrDefault('selectedTabId', undefined, true) as
    | number
    | undefined;

  if (result !== undefined) {
    return result as number;
  }
};

// Gets the active tab index from local storage, or returns undefined otherwise.
export const getActiveTabIndex = (): number | undefined => {
  const result = localStorageOrDefault('activeTabIndex', undefined, true) as
    | number
    | undefined;

  if (result !== undefined) {
    return result as number;
  }
};

// Gets saved active page from local storage, or returns undefined otherwise.
export const getActivePage = (
  tabId: number,
  route: Route,
  connected: boolean
): number | undefined => {
  const result = localStorageOrDefault('activePages', undefined, true) as
    | Record<string, number>
    | undefined;

  if (result) {
    // TODO: get from new structure.
    const activeIndex = result[`${tabId}:${connected ? 1 : 0}:${route}`];
    if (activeIndex) {
      return activeIndex as number;
    }
  }
};

// Gets temporary redirect from local storage, or returns undefined otherwise. If a redirect is
// found it is immediately removed from local storage.
export const getPageRedirect = (
  route: Route,
  tabId: number
): number | undefined => {
  const result = localStorageOrDefault('pageRedirects', undefined, true) as
    | Record<string, number>
    | undefined;

  if (result) {
    const value = result[`${tabId}:${route}`];
    // If page redirect exists, remove it before returning.
    if (value) {
      const updated = { ...result };
      delete updated[`${tabId}:${route}`];

      if (Object.keys(updated).length === 0) {
        localStorage.removeItem('pageRedirects');
      } else {
        localStorage.setItem('pageRedirects', JSON.stringify(updated));
      }

      return value as number;
    }
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets tabs state to local storage.
export const setTabs = (tabs: Tabs) => {
  localStorage.setItem('activeTabs', JSON.stringify(tabs));
};

// Sets the active tab id to local storage.
export const setActiveTabId = (id: number) => {
  localStorage.setItem('selectedTabId', id.toString());
};

// Sets the active tab index to local storage.
export const setSelectedTabIndex = (index: number) => {
  localStorage.setItem('activeTabIndex', index.toString());
};

export const setActivePage = (
  tabId: number,
  route: Route,
  connected: boolean,
  value: number
) => {
  const current =
    (localStorageOrDefault('activePages', undefined, true) as
      | Record<string, number>
      | undefined) || {};

  const updated = {
    ...current,
    [`${tabId}:${connected ? 1 : 0}:${route}`]: value,
  };
  localStorage.setItem('activePages', JSON.stringify(updated));
};

// Sets a temporary redirect to local storage.
export const setPageRedirect = (route: Route, tabId: number, value: number) => {
  const current =
    (localStorageOrDefault('pageRedirects', undefined, true) as
      | Record<string, number>
      | undefined) || {};

  const updated = {
    ...current,
    [`${tabId}:${route}`]: value,
  };
  localStorage.setItem('pageRedirects', JSON.stringify(updated));
};
