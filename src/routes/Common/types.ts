// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';
import type { PageWidth } from './PageWithMenu/types';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type PageSections = Record<
  number,
  {
    label: string;
    icon?: IconProp;
    Component: FC;
    pageWidth?: PageWidth;
  }
>;

export interface RouteSectionProvider {
  label: string;
  sections: PageSections;
  pageWidth: PageWidth;
}
