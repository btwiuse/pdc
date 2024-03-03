// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { SectionContextInterface } from './types';

export const defaultActiveSection = 0;

export const defaultSectionContext: SectionContextInterface = {
  activeSection: defaultActiveSection,
  setActiveSection: (section, persist) => {},
};