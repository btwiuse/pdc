// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  --connect-item-height: 3.5rem;
  padding: 0.75rem;

  > .scroll {
    box-shadow: var(--shadow-floating-menu);
    border: 1px solid var(--border-secondary-color);
    background: var(--background-default);
    border-radius: 0.4rem;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;

    > .inner {
      display: flex;
      flex-flow: column wrap;
      padding: 0.7rem;
      width: 100%;

      .title {
        flex: 1;
        display: flex;

        > h3 {
          color: var(--text-color-tertiary);
          margin-bottom: 0.35rem;
          font-size: 0.75rem;

          > svg {
            margin-right: 0.4rem;
          }
        }
        > button {
          border: 1px solid var(--border-secondary-color);
          background-color: var(--background-default);
          color: var(--text-color-tertiary);
          font-family: InterSemiBold, sans-serif;
          font-size: 0.75rem;
          margin-left: auto;
          padding: 0.25rem 0.5rem;
          border-radius: 0.4rem;
          cursor: pointer;

          &:hover {
            background-color: var(--background-hover);
          }
        }
      }

      > h4 {
        font-family: InterBold, sans-serif;
        margin: 0.75rem 0 0.4rem 0;
        overflow: hidden;
      }

      > span {
        overflow: hidden;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export const ItemWrapper = styled.div`
  background-color: var(--background-default);
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.4rem;
  flex: 1;
  padding: 0 0.6rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.55rem;

  &.last {
    margin-bottom: 0;
  }

  > div {
    height: var(--connect-item-height);
    display: flex;
    align-items: center;

    &:first-child {
      height: var(--connect-item-height);
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      max-width: 2rem;
      height: 100%;

      .icon-web {
        width: 1.6rem;
        height: 1.6rem;
      }

      > .icon {
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    &:last-child {
      flex-grow: 1;
      display: flex;
      padding-left: 0.5rem;

      > div {
        &:first-child {
          flex-grow: 1;

          > h4,
          > h5 {
            display: flex;
            align-items: center;
          }

          > h4 {
            font-family: InterBold, sans-serif;
            line-height: 0.85rem;
            margin-bottom: 0.25rem;

            &.connected {
              color: var(--text-color-primary);
            }

            > .badge {
              color: var(--text-color-secondary);
              border-radius: 0.25rem;
              font-size: 0.7rem;
              margin-left: 0.35rem;
            }
          }

          > h5 {
            color: var(--text-color-tertiary);
            font-family: InterSemiBold, sans-serif;

            > a {
              color: var(--text-color-tertiary);
              text-decoration: none;
              display: flex;
              align-items: center;

              > svg {
                margin-left: 0.15rem;
              }
            }
          }
        }
        &:last-child {
          padding-right: 0.25rem;

          > button {
            color: var(--accent-color-secondary);
            font-family: InterSemiBold, sans-serif;
            font-size: 0.75rem;

            svg {
              margin-right: 0.2rem;
            }

            &:disabled {
              color: var(--text-color-tertiary);
              cursor: default;
            }
          }
        }
      }
    }
  }
`;