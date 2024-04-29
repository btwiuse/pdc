// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useInput } from '.';
import { AddInputWrapper, SequenceItemWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import type { SequenceProps } from './types';

export const Sequence = ({
  namespace,
  inputKey,
  inputKeysRef,
  type,
  arrayInput,
  maxLength,
}: SequenceProps) => {
  const { readInput, renderInnerInput } = useInput();

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = 'Sequence';
  }

  // The number of inputs being rendererd.
  const [inputs, setInputs] = useState<number[]>([0]);

  const indices = Array.from(Array(inputs.length).keys());

  // Removes an input from state.
  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  // Adds an input to state.
  const addInput = () => {
    if (maxLength && inputs.length >= maxLength) {
      return;
    }
    setInputs([...inputs, inputs.length + 1]);
  };

  return (
    <>
      {indices.map((index) => {
        const subInputKey = `${inputKey}_${index}`;

        // Accumulate input key.
        if (inputKeysRef.current) {
          inputKeysRef.current[subInputKey] = 'SequenceItem';
        }

        // Amend label of input to be it's index.
        arrayInput.label = 'Item ' + (index + 1);

        // If maxLength is defined, append it to label.
        if (maxLength) {
          arrayInput.label += ` of ${maxLength}`;
        }

        // Generate input for this index.
        const subInput = readInput(
          type,
          { namespace, inputKey, inputKeysRef },
          arrayInput,
          true
        );

        return (
          <SequenceItemWrapper key={`input_arg_${subInputKey}`}>
            <div>{renderInnerInput(subInput)}</div>
            <div>
              <button onClick={() => removeInput(index)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </SequenceItemWrapper>
        );
      })}

      {!(maxLength && inputs.length >= maxLength) && (
        <AddInputWrapper>
          <button
            onClick={() => {
              addInput();
            }}
          >
            <FontAwesomeIcon icon={faAdd} transform="shrink-4" /> Add
          </button>
        </AddInputWrapper>
      )}
    </>
  );
};
