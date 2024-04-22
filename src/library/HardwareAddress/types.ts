// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { ComponentBase } from 'types';

export type HardwareAddressProps = ComponentBase & {
  // the network of the address.
  network: string;
  // the address to import.
  address: string;
  // the index of the address.
  index: number;
  // initial value of address.
  initial: string;
  // whether to disable editing if address is imported.
  disableEditIfImported?: boolean;
  // identicon of address.
  Identicon: ReactNode;
  // handle rename
  renameHandler: (address: string, newName: string) => void;
  // handle whether address already exists.
  existsHandler: (network: string, address: string) => boolean;
  // handle remove UI.
  onRemove: (address: string) => void;
  // handle confirm import UI.
  onConfirm: (address: string, index: number) => void;
  // Whether this is the last address.
  last?: boolean;
};