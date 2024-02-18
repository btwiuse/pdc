// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances.
  static instances: Record<string, ApiPromise> = {};
}