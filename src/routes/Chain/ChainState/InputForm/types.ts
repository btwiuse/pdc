// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputNamespace } from 'contexts/ChainUi/types';
import type { ReactNode, RefObject } from 'react';

export interface InputFormContextInterface {
  namespace: InputNamespace;
  inputKeysRef: RefObject<Record<string, string>>;
}

export interface InputFormProviderProps {
  namespace: InputNamespace;
  children: ReactNode;
}
