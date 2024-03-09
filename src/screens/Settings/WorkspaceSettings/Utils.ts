// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

// The supported localStorage keys for import and export.
// TODO: Reformat local pageSection keys to host in one `pageSections` key.
const SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS = [
  'activeTabs',
  'activeTabId',
  'activeTabIndex',
  'customNodeUrls',
  'searchTerms',
  'appliedTags',
];

// Exporting workspace settings.
export const exportWorkspace = () => {
  // Fetch all keys from localStorage
  const storageKeys = SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS;
  const exportData = storageKeys.reduce(
    (acc: Record<string, AnyJson>, key: string) => {
      acc[key] = localStorage.getItem(key); // Fetch each item and add to the export object
      return acc;
    },
    {}
  );

  //Remove falsy values.
  Object.keys(exportData).forEach((key) => {
    if (!exportData[key]) {
      delete exportData[key];
    }
  });

  // Convert to JSON and create a data URI to download the file.
  const dataStr = JSON.stringify(exportData, undefined);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'workspace-settings.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  linkElement.remove();
};
