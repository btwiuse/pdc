// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';
import { ChainState } from 'model/ChainState';
import type { OwnerId } from 'types';

export class ChainStateController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------
  // The currently instantiated chain state instances, keyed by ownerId.
  static instances: Record<ApiInstanceId, ChainState> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Get subscriptions from an instance.
  static getSubscriptions(instanceId?: ApiInstanceId) {
    return !instanceId
      ? {}
      : this.instances?.[instanceId]?.getEntries('subscription') || {};
  }

  // Get constants from an instance.
  static getConstants(instanceId?: ApiInstanceId) {
    return !instanceId
      ? {}
      : this.instances?.[instanceId]?.getEntries('constant') || {};
  }

  // ------------------------------------------------------
  // Chain state instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainState` instance with the supplied ownerId.
  static async instantiate(ownerId: OwnerId, instanceId: ApiInstanceId) {
    if (this.instances[instanceId]) {
      this.destroy(instanceId);
    }

    this.instances[instanceId] = new ChainState(ownerId, instanceId);
  }

  // Gracefully disconnect and then destroy an api instance.
  static destroy(instanceId: ApiInstanceId) {
    const instance = this.instances[instanceId];
    if (instance) {
      instance.unsubscribeAll();
      delete this.instances[instanceId];
    }
  }
}
