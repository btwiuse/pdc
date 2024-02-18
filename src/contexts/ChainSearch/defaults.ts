// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainSearchContextInterface } from './types';

export const defaultChainSearchContext: ChainSearchContextInterface = {
  searchTerms: {},
  getSearchTerm: (tabId) => '',
  setSearchTerm: (tabId, searchTerm) => {},
  appliedTags: {},
  getAppliedTags: (tabId) => [],
  applyTags: (tabId, tags) => {},
};

export const defaultAppliedTags = {
  1: ['Relay Chain', 'Test Network', 'Canary Network'],
  2: ['Relay Chain', 'Canary Network'],
  3: ['Relay Chain', 'Test Network'],
};