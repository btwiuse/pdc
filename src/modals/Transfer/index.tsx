// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { useAccounts } from 'contexts/Accounts';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { Title } from 'library/Modal/Title';
import { useOverlay } from 'library/Overlay/Provider';
import { ModalPadding } from 'library/Overlay/structure/ModalPadding';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useRef } from 'react';

export const Transfer = () => {
  const { getTxFee } = useTxMeta();
  const {
    address,
    instanceId,
    unit,
    units,
    api,
    chainId,
    ss58Prefix,
    existentialDeposit,
  } = useOverlay().modal.config.options;
  const { getNotEnoughFunds } = useAccounts();
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { getAccounts: getImportedAccounts } = useImportedAccounts();

  // A ref for the modal content container that is used for determining select dropdown height.
  const heightRef = useRef<HTMLDivElement>(null);

  // Get all imported accounts to populate account dropdowns.
  const accounts = getImportedAccounts(chainId, ss58Prefix);

  // Determine transaction fee and validity of submitting.
  const txFee = getTxFee(instanceId);
  const notEnoughFunds = getNotEnoughFunds(
    instanceId,
    address,
    txFee,
    existentialDeposit
  );
  const valid = notEnoughFunds === false;

  // Format the transaction to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api) {
      return tx;
    }

    try {
      tx = api.tx.balances.transferKeepAlive(
        {
          id: '5E7FRDqD4krjpxim4sBxW7vRqdQyEnaDws41GRfDvLkK2XRx', // NOTE: to address is hardcoded for testing.
        },
        unitToPlanck('1', units).toString()
      );
      return tx;
    } catch (e) {
      return null;
    }
  };

  // Prepare the extrinsic.
  const submitExtrinsic = useSubmitExtrinsic({
    instanceId,
    api,
    chainId,
    ss58Prefix,
    tx: getTx(),
    from: address,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  // Resize modal on element changes that effect modal height.
  useEffect(() => setModalResize(), [notEnoughFunds]);

  // Hard value on minimum modal height.
  const MIN_HEIGHT = 200;

  return (
    <div ref={heightRef}>
      <Title title="Transfer Funds" />
      <ModalPadding
        className="footer-padding"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <div>
          <h4 style={{ marginBottom: '0.22rem' }}>From</h4>
          {/* TODO: Allow default account value, allow disabled. */}
          <AccountId32
            accounts={accounts}
            onChange={(val) => {
              /* TODO: Update to address */
              console.log(val);
            }}
            heightRef={heightRef}
          />
          <h4 style={{ marginBottom: '0.22rem', marginTop: '1.25rem' }}>
            Recipient
          </h4>
          <AccountId32
            accounts={accounts}
            onChange={(val) => {
              /* TODO: Update to address */
              console.log(val);
            }}
            heightRef={heightRef}
          />
        </div>
      </ModalPadding>
      <SubmitTx
        {...submitExtrinsic}
        valid={valid}
        instanceId={instanceId}
        chainId={chainId}
        ss58Prefix={ss58Prefix}
        units={units}
        unit={unit}
        existentialDeposit={existentialDeposit}
      />
    </div>
  );
};
