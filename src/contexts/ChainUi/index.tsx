// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import {
  defaultChainContext,
  defaultChainUiInner,
  defaultChainUiItem,
  defaultChainUiState,
} from './defaults';
import type {
  ChainUiState,
  ChainUiContextInterface,
  ChainUiItem,
  PalletVersions,
  ChainUiItemInner,
  ChainStateSections,
  ChainStateSection,
} from './types';
import type { ApiPromise } from '@polkadot/api';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { u16 } from 'scale-ts';
import type { AnyJson } from '@w3ux/utils/types';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import type { MetadataVersion } from 'model/Metadata/types';

export const ChainUi =
  createContext<ChainUiContextInterface>(defaultChainContext);

export const useChainUi = () => useContext(ChainUi);

export const ChainUiProvider = ({ children }: { children: ReactNode }) => {
  // The UI state of the chain, keyed by tab.
  const [chainUi, setChainUi] = useState<ChainUiState>(defaultChainUiState);

  // The active chain state section, keyed by tab.
  const [activeChainStateSections, setActiveChainStateSections] =
    useState<ChainStateSections>({});

  // Stores pallet versions of a chain, keyed by tab.
  const [palletVersions, setPalletVersions] = useState<PalletVersions>({});

  // Gets an active chain state section by tabId. Falls back to 'storage'.
  const getActiveChainStateSection = (tabId: number): string =>
    activeChainStateSections[tabId] || 'storage';

  // Sets an active chain state section for a `tabId`.
  const setActiveChainStateSection = (
    tabId: number,
    section: ChainStateSection
  ) => {
    setActiveChainStateSections({
      ...activeChainStateSections,
      [tabId]: section,
    });
  };

  // Gets a ChainUi record by tabId.
  const getChainUi = (
    tabId: number,
    section: keyof ChainUiItem
  ): ChainUiItemInner => chainUi[tabId]?.[section] || defaultChainUiInner;

  // Sets a ChainUi record for a tabId and inner key.
  const setChainUiItem = (
    tabId: number,
    section: keyof ChainUiItem,
    key: string,
    value: string
  ) => {
    const currentChainUi = chainUi[tabId] || defaultChainUiItem;
    const currentChainUiItem = currentChainUi[section] || defaultChainUiInner;

    const newChainUiInner = {
      ...currentChainUiItem,
      [key]: value,
      // Reset selected value if the pallet is being changed.
      selected:
        key === 'pallet'
          ? ''
          : key === 'selected'
            ? value
            : currentChainUiItem.selected,
    };

    setChainUi({
      ...chainUi,
      [tabId]: {
        ...currentChainUi,
        [section]: newChainUiInner,
      },
    });
  };

  // Handle fetching of pallet versions.
  const fetchPalletVersions = async (
    tabId: number,
    metadata: MetadataVersion,
    apiInstance: ApiPromise
  ) => {
    // Get pallet list from scraper.
    const scraper = new PalletScraper(metadata);
    const pallets = scraper.getList();

    // Map through pallets and set up an array of calls to query the RPC with.
    const calls = pallets.map(({ name }) => {
      const storageKey =
        xxhashAsHex(name, 128) +
        xxhashAsHex(':__STORAGE_VERSION__:', 128).slice(2);
      return apiInstance.rpc.state.getStorage(storageKey);
    });

    const result = await Promise.all(calls);

    const newPalletVersions = Object.fromEntries(
      result.map((element: AnyJson, index: number) => {
        // Empty return types can be assumed to be version 0.
        const versionAsHex = element.toHex();
        return [
          pallets[index].name,
          versionAsHex == '0x' ? '0' : String(u16.dec(element.toString())),
        ];
      })
    );

    // Set pallet version state for the provided tab.
    setPalletVersions((prev) => ({
      ...prev,
      [tabId]: newPalletVersions,
    }));
  };

  // Get pallet versions by tab Id.
  const getPalletVersions = (
    tabId: number
  ): Record<string, string> | undefined => palletVersions[tabId];

  return (
    <ChainUi.Provider
      value={{
        chainUi,
        getChainUi,
        setChainUiItem,
        getPalletVersions,
        fetchPalletVersions,
        getActiveChainStateSection,
        setActiveChainStateSection,
      }}
    >
      {children}
    </ChainUi.Provider>
  );
};