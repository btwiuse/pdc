// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import {
  SettingsHeaderButton,
  SettingsHeaderWrapper,
  SettingsSubheadingWrapper,
} from 'library/Settings/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { MangeTagItem } from './MangeTagItem';
import { ManageTagForm } from './ManageTagForm';

export const TagSettings = () => {
  const { tags } = useTags();
  const totalTags = Object.keys(tags).length;

  // The current value of the new tag input.
  const [newTagValue, setNewTagValue] = useState<string>('');

  // Whether the new tag form is open.
  const [newTagOpen, setNewTagOpen] = useState<boolean>(false);

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Manage Tags</h2>
        <div>
          <SettingsHeaderButton onClick={() => setNewTagOpen(!newTagOpen)}>
            <FontAwesomeIcon
              icon={newTagOpen ? faMinus : faPlus}
              transform="shrink-1"
            />
            New Tag
          </SettingsHeaderButton>
        </div>
      </SettingsHeaderWrapper>

      {newTagOpen && (
        <ManageTagForm
          value={newTagValue}
          setValue={setNewTagValue}
          setOpen={setNewTagOpen}
        />
      )}

      <SettingsSubheadingWrapper>
        {totalTags} {totalTags === 1 ? 'tag' : 'tags'}
      </SettingsSubheadingWrapper>

      {Object.entries(tags).map(([id, tag]) => (
        <MangeTagItem key={`tag_${id}`} id={id} tag={tag} />
      ))}
    </>
  );
};