// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { useRoute } from 'contexts/Route';
import { useEffect } from 'react';
import { useActiveTab } from 'contexts/ActiveTab';

// NOTE: This hook can only be used within <Page> components; it is dependent on RouteProvider.
export const useRedirectOnInactive = () => {
  const activeTab = useActiveTab();
  const { getApiStatus } = useApi();
  const { setActivePage } = useRoute();

  const apiStatus = getApiStatus(activeTab.ownerId);
  const INACTIVE_API_STATUSES = ['disconnected', 'error'];
  const apiInactive = INACTIVE_API_STATUSES.includes(apiStatus);

  //  Redirect to section 0 if api is no longer connected. Do not persist - user might want to land
  //  on this section again on subsequent visits. Forces redirect on tab change if that tab was on a
  //  different section.
  useEffect(() => {
    if (apiInactive) {
      setActivePage(0, false);
    }
  }, [apiStatus, activeTab]);
};
