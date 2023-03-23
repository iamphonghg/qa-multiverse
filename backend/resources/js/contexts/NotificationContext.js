import React, { createContext, useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { useUserAuth } from './UserAuthContext';
import UserAPI from '../api/UserAPI';

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const { currentUser } = useUserAuth();

  const { data, isLoading, refetch } = useQuery(
    'notifications',
    () => UserAPI.getNotifications(),
    { keepPreviousData: true }
  );

  const { mutate: toggleNewNoti } = useMutation(
    () => UserAPI.toggleNewNoti(),
    { onSuccess: () => refetch() }
  );

  const hasNewNoti = useMemo(() => {
    if (data && data.length > 0) {
      return data.some((noti) => {
        if (!JSON.parse(noti?.read_ids).includes(currentUser?.id))
          return true;
        return false;
      });
    }
    return false;
  }, [currentUser?.id, data]);

  console.log('hasNewNoti', hasNewNoti);

  return (
    <NotificationContext.Provider
      value={{ notifications: data, hasNewNoti, toggleNewNoti }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

const useNotificationContext = () => {
  const context = React.useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      `useNotificationContext must be used within a NotificationProvider`
    );
  }

  return context;
};

NotificationProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default NotificationProvider;
export { useNotificationContext };
