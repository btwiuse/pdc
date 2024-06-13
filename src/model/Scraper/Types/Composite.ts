// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { CompositeField, CompositeType, MetadataType } from './types';

// Class to hold a composite type.
export class Composite implements MetadataType {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The fields of this composite.
  fields: CompositeField[];

  constructor(composite: CompositeType, lookup: LookupItem) {
    this.fields = composite.fields;
    this.lookup = lookup;
  }

  // Scrape composite fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return [...this.fields].map((field) => ({
      ...field,
      type: scraper.start(field.type, trailId),
    }));
  }
}
