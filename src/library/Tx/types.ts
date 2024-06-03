// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmitTxStyleProps } from 'library/SubmitTx/types';
import type { ReactElement } from 'react';
import type { DisplayFor } from 'types';

export interface SignerProps {
  label: string;
  name: string;
  notEnoughFunds: boolean;
  dangerMessage: string;
}

export interface TxProps extends SignerProps {
  margin?: boolean;
  SignerComponent: ReactElement;
  displayFor?: DisplayFor;
  style?: SubmitTxStyleProps;
}