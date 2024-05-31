// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const PromptWrapper = styled.div`
  background: var(--overlay-background-color);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 11;

  /* content wrapper */
  > div {
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 2rem 2rem;

    /* click anywhere behind overlay to close */
    .close {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 8;
      cursor: default;
    }

    /* status message placed below title */
    h4.subheading {
      margin-bottom: 1rem;
    }

    /* padded content to give extra spacing */
    .padded {
      padding: 1rem 1.5rem;
    }
  }
`;

export const HeightWrapper = styled.div<{ size: string }>`
  transition: height 0.5s cubic-bezier(0.1, 1, 0.2, 1);
  width: 100%;
  max-width: ${(props) => (props.size === 'small' ? '500px' : '700px')};
  max-height: 100%;
  border-radius: 1.5rem;
  z-index: 9;
  position: relative;
  overflow: auto;
`;

export const ContentWrapper = styled.div`
  background: var(--background-default);
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;

  a {
    color: var(--accent-color-primary);
  }
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 1rem 2rem 0 2rem;
  }
  .body {
    padding: 0.5rem 1.5rem 1.25rem 1.5rem;
    h4 {
      margin: 1rem 0;
    }
  }
`;
