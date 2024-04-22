// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface SelectDropdownProps {
  open: boolean;
  children: ReactNode;
  onOutsideClick: () => void;
  outsideAlerterIgnore?: string[];
  className?: string;
}