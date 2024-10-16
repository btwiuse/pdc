// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { AnimatePresence, motion } from 'framer-motion';
import { Wrapper } from './Wrapper';
import { useRef, useState } from 'react';
import { setStateWithRef } from '@w3ux/utils';
import { useEventListener } from 'usehooks-ts';
import type {
  NotificationInterface,
  NotificationItem,
} from 'controllers/Notifications/types';
import { isCustomEvent } from 'Utils';

export const Notifications = () => {
  // Store the notifications currently being displayed.
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  // A ref is needed to access notifications state in event listener.
  const notificationsRef = useRef(notifications);

  // Adds a notification to the list of notifications.
  const handleAddNotification = (detail: NotificationItem) => {
    const newNotifications: NotificationInterface[] = [
      ...notificationsRef.current,
    ];
    newNotifications.push({ index: detail.index, item: detail });
    setStateWithRef(newNotifications, setNotifications, notificationsRef);
  };

  // Removes a notification from state if its index exists.
  //
  // NOTE: If `index` has already been dismissed via a UI interaction, nothing will happen here.
  const handleDismissNotification = (index: number) => {
    const newNotifications = notificationsRef.current.filter(
      (notification) => notification.index !== index
    );
    setStateWithRef(newNotifications, setNotifications, notificationsRef);
  };

  // Callback for notifications event listener.
  const notificationCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { task, ...rest } = e.detail;

      switch (task) {
        case 'add':
          handleAddNotification(rest);
          break;
        case 'dismiss':
          handleDismissNotification(rest.index);
          break;
        default:
      }
    }
  };

  // Add event listener for notifications.
  const ref = useRef<Document>(document);
  useEventListener('notification', notificationCallback, ref);

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        {notifications.length > 0 &&
          notifications.map(
            (notification: NotificationInterface, i: number) => {
              const { item, index } = notification;

              return (
                <motion.li
                  key={`notification_${i}`}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.75,
                    y: -50,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleDismissNotification(index);
                  }}
                >
                  {item.title && <h3>{item.title}</h3>}
                  {item.subtitle && <p>{item.subtitle}</p>}
                </motion.li>
              );
            }
          )}
      </AnimatePresence>
    </Wrapper>
  );
};