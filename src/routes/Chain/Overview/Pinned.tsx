// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChainState } from 'contexts/ChainState';
import { Results } from '../ChainState/Results';
import { Subheading } from './Wrappers';
export const Pinned = () => {
  const { getTotalPinnedItems } = useChainState();

  const totalPinnedItems = getTotalPinnedItems();

  return (
    <>
      <Subheading className={totalPinnedItems === 0 ? 'underlined' : undefined}>
        Pinned Chain State
      </Subheading>
      <Results withSpacer={false} />
    </>
  );
};