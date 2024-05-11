// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  ParaSetupContextInterface,
  SelectedRelayChains,
  SetupStep,
  SetupStepsState,
} from './types';
import { defaultParaSetupContext } from './defaults';
import type { ChainId } from 'config/networks';
import { useTabs } from 'contexts/Tabs';

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  const { removeChainSpaceApiIndex } = useTabs();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<SetupStepsState>({});

  // Store the currently selected relay chain, keyed by tab.
  const [selectedRelayChains, setSelectedRelayChains] =
    useState<SelectedRelayChains>({});

  // Store  confirmed relay chains, keyed by tab.
  const [confirmedRelayChains, setConfirmedRelayChains] =
    useState<SelectedRelayChains>({});

  // Get the selected relay chain for a tab.
  const getSelectedRelayChain = (tabId: number) =>
    selectedRelayChains[tabId] || 'polkadot';

  // Set the selected relay chain for a tab.
  const setSelectedRelayChain = (tabId: number, chainId: ChainId) => {
    setSelectedRelayChains({
      ...selectedRelayChains,
      [tabId]: chainId,
    });
  };

  // Get the confirmed relay chain for a tab.
  const getConfirmedRelayChain = (tabId: number) => confirmedRelayChains[tabId];

  // Set the confirmed relay chain for a tab.
  const setConfirmedRelayChain = (tabId: number, chainId: ChainId) => {
    setConfirmedRelayChains({
      ...confirmedRelayChains,
      [tabId]: chainId,
    });
  };

  // Get the active step for a tab id, or 1 otherwise.
  const getActiveStep = (tabId: number) =>
    activeSteps[tabId] || 'connect_relay';

  // Set an active step for a tab id.
  const setActiveStep = (tabId: number, step: SetupStep) => {
    setActiveSteps((prev) => ({
      ...prev,
      [tabId]: step,
    }));
  };

  // Destroy state associated with a tab. Should only be used on tab close.
  const destroyTabParaSetup = (tabId: number) => {
    const updated = { ...activeSteps };
    delete updated[tabId];
    setActiveSteps(updated);

    const updatedSelectedRelayChains = { ...selectedRelayChains };
    delete updatedSelectedRelayChains[tabId];
    setSelectedRelayChains(updatedSelectedRelayChains);

    const updatedConfirmedRelayChains = { ...confirmedRelayChains };
    delete updatedConfirmedRelayChains[tabId];
    setSelectedRelayChains(updatedConfirmedRelayChains);

    // Remove api instances from tab chain space indexes.
    removeChainSpaceApiIndex(tabId);
  };

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        getSelectedRelayChain,
        setSelectedRelayChain,
        getConfirmedRelayChain,
        setConfirmedRelayChain,
        destroyTabParaSetup,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
