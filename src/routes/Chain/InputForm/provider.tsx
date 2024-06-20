// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext } from 'react';
import { defaultInputFormContext } from './defaults';
import type {
  InputFormContextInterface,
  InputFormProviderProps,
} from './types';
import {
  formatSingleArg,
  getDeepestKeys,
  getParentKeyValues,
  updateInputsAndRemoveChildren,
} from './Utils';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';
import type { AnyJson } from '@w3ux/types';

export const InputForm = createContext<InputFormContextInterface>(
  defaultInputFormContext
);

export const useInputForm = () => useContext(InputForm);

export const InputFormProvider = ({
  namespace,
  children,
  scraper,
}: InputFormProviderProps) => {
  const { tabId } = useActiveTab();
  const { getInputArgs } = useChainUi();

  // A reference to accumulate input keys for an input form.
  const inputKeys: Record<string, string> = {};

  // Handle query submission. Accumulates input values and passes them into the provided `onSubmit`
  // function.
  const handleSubmit = (onSubmit?: (args: AnyJson) => void) => {
    // Exit early if no scraper is present.
    if (!scraper) {
      return;
    }

    // Get input keys for manipulation.
    let formattedKeys = { ...inputKeys } as Record<string, AnyJson>;
    const inputArgs = getInputArgs(tabId, namespace);

    // If no input args exist, formatted keys is simply an empty object. Otherwise, go ahead and recursively construct input values from args.
    if (inputArgs === null) {
      formattedKeys = {};
    } else {
      // Extract `arg` from each input arg record.
      const argValues = Object.fromEntries(
        Object.entries(inputArgs || {}).map(([key, { arg }]) => [key, arg])
      );

      // Gets the deepest keys of inputKeys object. There could be more than 1 key with the
      // longest length.
      let { deepestKeys, maxLength } = getDeepestKeys(formattedKeys);

      // Check whether there is only a single argument to pass into this query.
      const singleInput = maxLength === 1;

      do {
        // Exit early if only a single arg.
        if (singleInput) {
          formattedKeys[0] = formatSingleArg(formattedKeys, argValues);
          break;
        }

        // Take the values of those deepest keys.
        const deepestKeysWithValue = Object.fromEntries(
          deepestKeys.map((key) => [key, formattedKeys[key]])
        );

        // Get parent keys of deepest keys.
        const parentValues = getParentKeyValues(
          inputKeys,
          argValues || {},
          deepestKeysWithValue
        );

        // For each key of `parentValues` commit the value to `inputKeys` under the same
        // key.
        formattedKeys = updateInputsAndRemoveChildren(
          inputKeys,
          parentValues,
          deepestKeys
        );

        // Update `deepestKeys` for next iteration.
        const newDeepestKeys = getDeepestKeys(formattedKeys);
        deepestKeys = newDeepestKeys.deepestKeys;
        maxLength = newDeepestKeys.maxLength;
      } while (deepestKeys.length > 1);
    }

    // Determine whether inputs are empty.
    const isEmpty = Object.values(formattedKeys).length === 0;

    // Determine whether there is a single argument or a tuple of arguments.
    const isTuple = Object.values(formattedKeys)?.[0]?.[0] === 'Tuple';

    // Take the resulting arguments for query submission. If there are no inputs, no
    // arguments are needed for the query.
    const resultInput = isEmpty
      ? null
      : isTuple
        ? Object.values(formattedKeys)?.[0][1]
        : Object.values(formattedKeys)?.[0];

    console.log('---');
    console.log(resultInput);

    // Call a submission function if it exists.
    if (typeof onSubmit === 'function') {
      onSubmit(resultInput);
    }

    return resultInput;
  };

  return (
    <InputForm.Provider
      value={{
        namespace,
        inputKeys,
        handleSubmit,
      }}
    >
      {children}
    </InputForm.Provider>
  );
};
