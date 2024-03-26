// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InputFormWrapper, SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { Fragment, useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { FormatInputFields } from 'model/Metadata/Format/InputFields';
import type { AnyJson } from '@w3ux/utils/types';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useInput } from '../Inputs';
import { useActiveTabId } from 'contexts/ActiveTab';

export const StorageItems = () => {
  const { readInput } = useInput();
  const { getChainSpec } = useApi();
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'storage';
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const storageData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        storageItems: [],
        activeStorageItem: null,
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    const pallets = scraper.getList(['storage']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get storage items for the active pallet and sort by name.
    const storageItems = (
      activePallet ? scraper.getStorage(activePallet) : []
    ).sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    // If no storage item selected, select the first one from the list or fall back to null.
    const activeStorageItem =
      chainUi.selected || storageItems?.[0]?.name || null;

    return {
      pallets,
      activePallet,
      storageItems,
      activeStorageItem,
    };
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, storageItems, activeStorageItem } =
    storageData;

  // Get the whole active storage item record for input formatting.
  const activeListItem = storageItems.find(
    (item) => item.name === activeStorageItem
  );

  // Get input markup for the active storage item.
  const inputForm =
    activePallet !== null && activeStorageItem !== null && !!activeListItem
      ? new FormatInputFields(activeListItem).format()
      : null;

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          subject="Storage Item"
          items={storageItems}
          activeItem={activeStorageItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputFormWrapper>
        {!!inputForm &&
          Object.entries(inputForm).map(([type, input]: AnyJson, index) => {
            const key = `input_${index}`;
            return <Fragment key={key}>{readInput(type, input, key)}</Fragment>;
          })}
        <section className="footer">
          <ButtonSubmit
            onClick={() => {
              /* Do nothing */
            }}
          >
            Submit
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </ButtonSubmit>
        </section>
      </InputFormWrapper>
    </>
  );
};
