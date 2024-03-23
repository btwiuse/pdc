// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataVersion } from './types';
import type { Metadata } from '@polkadot/types';

export class UnknownMetadata implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  getMetadataJson() {
    return this.metadata.toJSON().metadata;
  }
}