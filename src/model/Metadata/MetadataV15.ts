// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion } from './types';

export class MetadataV15 implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  getMetadataJson() {
    const json = this.metadata.toJSON().metadata as { v15: unknown };
    return json.v15;
  }
}