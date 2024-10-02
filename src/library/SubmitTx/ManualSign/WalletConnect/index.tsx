// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import type { SubmitProps } from '../../types';
import { appendOrEmpty } from '@w3ux/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { useExtrinsicData } from 'library/SubmitTx/ExtrinsicDataProvider';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useWalletConnect } from 'contexts/WalletConnect';

export const WalletConnect = ({
  onSubmit,
  submitting,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const {
    getSender,
    txFeeValid,
    getTxPayload,
    setTxSignature,
    getTxSignature,
  } = useTxMeta();
  const { signWcTx } = useWalletConnect();
  const { getChainIdCaip } = useChainSpaceEnv();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, valid } = useExtrinsicData();

  // TODO: Replace with real WC request status.
  const requestStatus = 0;

  // The state under which submission is disabled.
  const disabled =
    submitting ||
    !valid ||
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !txFeeValid(instanceId);

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonText: string;
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;

  if (getTxSignature(instanceId) !== undefined || submitting) {
    buttonText = submitText || '';
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
  } else {
    buttonText = requestStatus === 0 ? 'Sign' : 'Signing';
    buttonOnClick = async () => {
      const caip = getChainIdCaip(chainId);
      const from = getSender(instanceId);
      const payload = getTxPayload(instanceId);
      if (!from || !payload) {
        return;
      }

      const signature = await signWcTx(caip, from, payload);

      if (signature) {
        setTxSignature(instanceId, signature);
      }
    };

    buttonDisabled = disabled || requestStatus !== 0;
  }

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee />
        {valid ? <p>Ready to Submit Transaction.</p> : <p>Form Incomplete.</p>}
      </div>
      <div>
        {buttons}
        {displayFor !== 'card' ? (
          <ButtonText onClick={() => buttonOnClick()} disabled={buttonDisabled}>
            {buttonText}
            <FontAwesomeIcon icon={faSquarePen} className="iconRight" />
          </ButtonText>
        ) : (
          <ButtonText onClick={() => buttonOnClick()} disabled={buttonDisabled}>
            {buttonText}
            <FontAwesomeIcon icon={faSquarePen} className="iconRight" />
          </ButtonText>
        )}
      </div>
    </div>
  );
};
