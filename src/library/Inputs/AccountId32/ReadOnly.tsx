// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { TextInputWrapper } from '../Wrappers';
import { ellipsisFn, isValidAddress, remToUnit } from '@w3ux/utils';
import type { AccountId32ReadOnlyProps } from './types';

export const AccountId32ReadOnly = ({
  defaultAddress,
  accounts,
  emptyText,
}: AccountId32ReadOnlyProps) => {
  // Attempt to get address name from accounts.
  let inputValue =
    accounts?.find(({ address }) => address === address)?.name ||
    defaultAddress;

  // If no input value still exists, fall back to empty text.
  if (!inputValue) {
    inputValue = emptyText || 'No Account';
  }

  const address = defaultAddress || '';

  return (
    <TextInputWrapper className={`input disabled`}>
      <span className="icon">
        <Polkicon
          address={address}
          size={remToUnit('1.5rem')}
          outerColor="var(--background-primary)"
        />
      </span>
      <input
        type="text"
        className="ignore-outside-alerter-search-input"
        value={inputValue}
        disabled={true}
      />
      <span>
        <h5>{isValidAddress(address) ? ellipsisFn(address, 14) : ''}</h5>
      </span>
    </TextInputWrapper>
  );
};