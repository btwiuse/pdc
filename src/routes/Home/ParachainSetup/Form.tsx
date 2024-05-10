// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParaSetup } from 'contexts/ParaSetup';
import { Icon } from './Icon';
import { useActiveTab } from 'contexts/ActiveTab';
import { ConnectRelay } from './ConnectRelay';
import { Progress } from './Progress';
import { Footer } from './Footer';
import { ReserveParaId } from './ReserveParaId';
import { FormWrapper, HomePageWrapper } from '../Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';

export const Form = () => {
  const { tabId } = useActiveTab();
  const { getActiveStep, getChainSpaceApiIndex } = useParaSetup();
  const { getChainApi, getApiStatusByIndex } = useChainSpaceEnv();

  const chainSpaceApiIndex = getChainSpaceApiIndex(tabId);
  const relayInstance = getChainApi(chainSpaceApiIndex);

  const apiStatus = getApiStatusByIndex(chainSpaceApiIndex);
  const activeStep = getActiveStep(tabId);

  // Get the relay chain icon, if available.
  const relayIcon = relayInstance
    ? `../../../config/networks/icons/${relayInstance.chainId}/Inline.tsx`
    : undefined;

  // Determine whether next button should be disabled.
  const nextDisabled = activeStep === 'connect_relay' && apiStatus !== 'ready';

  return (
    <HomePageWrapper>
      <h2>
        Set up a New Parachain
        {relayIcon && (
          <div className="icon">
            <Icon icon={relayIcon} />
          </div>
        )}
      </h2>

      <Progress />

      {activeStep === 'connect_relay' && <ConnectRelay />}

      {activeStep === 'reserve_para_id' && <ReserveParaId />}

      {activeStep === 'configure_node' && (
        <FormWrapper>
          <h3>Configure your Parachain Node to connect to the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'register_parathread' && (
        <FormWrapper>
          <h3>Register your Parathread on the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'get_coretime' && (
        <FormWrapper>
          <h3>
            Get bulk or instantaneous Coretime and start processing blocks.
          </h3>
        </FormWrapper>
      )}

      <Footer nextDisabled={nextDisabled} />
    </HomePageWrapper>
  );
};