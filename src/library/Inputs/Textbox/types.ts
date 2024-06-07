// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputCallbackProps } from '../types';

export type TextboxProps = InputCallbackProps & {
  label?: { short?: string; long?: string } | string | number;
  value: string;
  numeric?: boolean;
  placeholder?: string;
};
