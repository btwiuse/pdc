// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { TextInputWrapper } from '../Wrappers';

export const Textbox = ({
  label,
  defaultValue,
  numeric,
}: {
  label: string | number;
  defaultValue: string | number;
  numeric?: boolean;
}) => {
  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    if (numeric && isNaN(Number(val))) {
      return;
    }
    setValue(val);
  };

  return (
    <>
      <h4>{label}</h4>
      <TextInputWrapper className="input">
        <input
          type="text"
          value={value || ''}
          onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
        />
      </TextInputWrapper>
    </>
  );
};
