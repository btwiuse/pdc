// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataType } from './types';

// Class to hold a primitive type.
export class Primitive implements MetadataType {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this primitive.
  primitive: string;

  constructor(primitive: string, lookup: LookupItem) {
    this.lookup = lookup;
    this.primitive = primitive;
  }

  // Get the label of this primitive.
  label() {
    return this.primitive.toLowerCase();
  }

  // Scrape primitive type. Simply returns the type.
  scrape() {
    return this.primitive;
  }
}
