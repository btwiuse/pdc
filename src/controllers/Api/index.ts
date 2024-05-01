// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { Api } from 'model/Api';
import type { OwnerId } from 'model/Api/types';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, Api>> = {};

  // Get an instance `api` by ownerId and instanceIndex.
  static getInstance(ownerId: OwnerId, instanceIndex: number) {
    return this.#instances[ownerId][instanceIndex].api;
  }

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied owner, chainId and endpoint.
  static async instantiate(
    ownerId: OwnerId,
    chainId: ChainId,
    endpoint: string
  ) {
    let instanceIndex = 0;
    // Initialise array of instances for this ownerId if it doesn't exist.
    if (!this.#instances[ownerId]) {
      this.#instances[ownerId] = {};
    } else {
      // If #instances already exist for this owner, get largest instanceIndex and increment it.
      instanceIndex =
        Object.keys(this.#instances[ownerId] || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    this.#instances[ownerId][instanceIndex] = new Api(
      ownerId,
      instanceIndex,
      chainId,
      endpoint
    );
    await this.#instances[ownerId][instanceIndex].initialize();
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(ownerId: OwnerId, instanceIndex: number) {
    const api = this.#instances[ownerId][instanceIndex];
    if (api) {
      await api.disconnect(true);
      delete this.#instances[ownerId];
    }
  }
}
