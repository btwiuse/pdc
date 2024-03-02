// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useTabs } from 'contexts/Tabs';
import { TextInput } from 'library/TextInput';
import { useState } from 'react';
import { RenameTabWrapper } from './Wrappers';
import { Switch } from 'library/Switch';

export const RenameTab = () => {
  const { activeTabId, getActiveTab, renameTab } = useTabs();

  // The editable value of the input.
  const initialValue = getActiveTab()?.name || '';
  const [editableValue, setEditableValue] = useState<string>(initialValue);

  // Whether auto connect is turned on.
  const [autoConnect, setAutoConnect] = useState<boolean>(true);

  // Handle tab name form submission.
  const onSubmit = (value: string) => {
    if (value) {
      setEditableValue(value);
      renameTab(activeTabId, value);
    }
  };

  // Handle tab name change.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && editableValue === '')) {
      setEditableValue(value);
    }
  };

  // Handle auto connect toggle.
  const handleOnSwitch = (val: boolean) => {
    setAutoConnect(val);
  };

  // Update tab value when active tab changes.
  useEffectIgnoreInitial(() => {
    setEditableValue(initialValue);
  }, [activeTabId, initialValue]);

  return (
    <RenameTabWrapper>
      <TextInput
        name="tab_name"
        value={editableValue}
        placeholder="Tab Name"
        label="Tab Name"
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <div className="controls">
        <h4
          style={{
            color: autoConnect ? 'var(--accent-color-secondary)' : undefined,
          }}
        >
          Auto Connect
        </h4>
        <Switch
          scale={0.85}
          active={autoConnect}
          disabled={false}
          onSwitch={handleOnSwitch}
        />
      </div>
    </RenameTabWrapper>
  );
};