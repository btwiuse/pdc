// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasCardWrapper, CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useOverlay } from 'library/Overlay/Provider';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { PalletItem } from './PalletItem';

export const RuntimeSnapshot = () => {
  const {
    closeCanvas,
    config: { options = {} },
  } = useOverlay().canvas;

  const { chainSpec } = options;
  const metadata = chainSpec.metadata;

  // Get pallet list from scraper.
  const scraper = new PalletScraper(metadata);
  const pallets = scraper.getPalletList();

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonText onClick={() => closeCanvas()}>Close</ButtonText>
      </div>

      <h1>Runtime Snapshot</h1>

      <CanvasCardWrapper>
        <h2>Pallets</h2>

        {pallets.map((pallet) => (
          <PalletItem pallet={pallet} key={`pallet_${pallet.index}`} />
        ))}
      </CanvasCardWrapper>
    </CanvasFullScreenWrapper>
  );
};
