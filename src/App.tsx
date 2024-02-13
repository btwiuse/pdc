// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Entry } from '@polkadot-cloud/react';
import { useTabs } from 'contexts/Tabs';
import { Header } from 'library/Header';
import { Footer } from 'library/Footer';
import { Menu } from 'library/Menu';

import { Tabs } from 'library/Tabs';

export const App = () => {
  const { getActiveTab } = useTabs();

  return (
    <Entry mode="light" theme={`polkadot-relay`}>
      <Menu />
      <Header />
      <Tabs />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>{getActiveTab()?.name || 'No ActiveTab'}</h1>
      </div>
      <Footer />
    </Entry>
  );
};
