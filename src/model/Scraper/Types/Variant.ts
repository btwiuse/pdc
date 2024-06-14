// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { MetadataType, VariantItem } from './types';
import type { TrailParam } from '../types';
import { Base } from './Common/Base';

// Class to hold a variant type.
export class Variant extends Base implements MetadataType {
  type = 'variant';

  // The variants of this variant type.
  items: VariantItem[];

  constructor(variants: VariantItem[], lookup: LookupItem) {
    super(lookup);
    this.items = variants;
  }

  // Variants (enums) are themselves a multi-select input, that then effect child inputs.
  input() {
    return 'select';
  }

  // Scrape variant fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return [...this.items].map((item) => ({
      ...item,
      fields: item.fields.map((field) => ({
        ...field,
        type: scraper.start(field.type, trailId),
      })),
    }));
  }
}
