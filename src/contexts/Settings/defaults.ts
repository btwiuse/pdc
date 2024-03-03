// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { SettingsContextInterface } from './types';

export const defaultSettingsContext: SettingsContextInterface = {
  autoConnect: true,
  autoTabNaming: true,
  setAutoConnect: (value) => {},
  setAutoTabNaming: (value) => {},
};