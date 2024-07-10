// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonWrapper, HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { accentColors } from 'styles/accents/developer-console';
import type { RouteSectionProvider } from 'routes/Common/types';
import { useSettings } from 'contexts/Settings';

export const SettingsMenu = ({ label, sections }: RouteSectionProvider) => {
  const navigate = useNavigate();
  const { activePage, setActivePage } = useSettings();

  return (
    <HeaderMenuWrapper
      /* Overriding tab color to be the same as primary color. */
      style={Object.fromEntries([
        ['--accent-color-secondary', accentColors.primary.light],
      ])}
    >
      <div className="menu">
        <section>
          <div className="label">{label}</div>
          {Object.entries(sections).map(([key, section], index) => (
            <button
              key={`menu-section-${key}-${index}`}
              className={activePage === Number(key) ? 'active' : undefined}
              onClick={() => setActivePage(Number(key))}
            >
              {section?.icon && (
                <FontAwesomeIcon icon={section.icon} className="icon" />
              )}
              {section.label}
            </button>
          ))}
        </section>
      </div>
      <div className="config">
        <ButtonWrapper onClick={() => navigate('/')} className="button">
          <FontAwesomeIcon icon={faCheck} />
          Done
        </ButtonWrapper>
      </div>
    </HeaderMenuWrapper>
  );
};
