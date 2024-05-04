// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ParaSetupContextInterface, SetupStep } from './types';

export const defaultParaSetupContext: ParaSetupContextInterface = {
  getActiveStep: (tabId) => 'reserve_para_id',
  setActiveStep: (tabId, step) => {},
  registerRelayApi: (tabId) => {},
  getRelayApi: (tabId) => undefined,
};

export const setupSteps: SetupStep[] = [
  'reserve_para_id',
  'configure_node',
  'register_parathread',
  'get_coretime',
];
