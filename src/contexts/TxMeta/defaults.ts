// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  senders: {},
  getSender: (instanceId) => undefined,
  setSender: (instanceId, sender) => {},
  removeSender: (instanceId) => {},

  getTxFee: (instanceId) => new BigNumber(0),
  setTxFee: (instanceId, fees) => {},
  removeTxFee: (instanceId) => {},
  txFeeValid: (instanceId) => false,

  getTxPayload: (instanceId) => undefined,
  getTxPayloadUid: (instanceId) => 0,
  setTxPayload: (instanceId, payload, uid) => {},
  removeTxPayload: (instanceId) => {},
  incrementTxPayloadUid: (instanceId) => 1,

  getTxSignature: (instanceId) => undefined,
  setTxSignature: (instanceId, signature) => {},
  removeTxSignature: (instanceId) => {},

  getPendingNonces: (instanceId) => [],
  addPendingNonce: (instanceId, nonce) => {},
  removePendingNonce: (instanceId, nonce) => {},

  destroyInstanceTxMeta: (instanceId) => {},
};