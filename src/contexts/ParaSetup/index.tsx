// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ParaSetupContextInterface, SetupStep } from './types';
import { defaultParaSetupContext } from './defaults';
import type { ChainId } from 'config/networks';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<Record<number, SetupStep>>({});

  // Store the currently selected relay chain.
  const [selectedRelayChain, setSelectedRelayChain] =
    useState<ChainId>('polkadot');

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

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        selectedRelayChain,
        setSelectedRelayChain,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
