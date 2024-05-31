// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ImportedAccountsContextInterface } from './types';

export const defaultImportedAccountsContext: ImportedAccountsContextInterface =
  {
    getAccounts: (chainId, ss58Prefix) => [],
    getAccount: (address, chainId, ss58Prefix) => undefined,
    accountHasSigner: (address, chainId, ss58Prefix) => false,
    requiresManualSign: (address, chainId, ss58Prefix) => false,
  };
