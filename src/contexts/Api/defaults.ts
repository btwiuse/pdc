// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ApiContextInterface } from './types';

export const defaultApiContext: ApiContextInterface = {
  isReady: false,
  getTabApi: () => undefined,
  getApiStatus: (tabId) => 'disconnected',
  getApiActive: (tabId) => false,
  getChainSpec: (tabId) => null,
};