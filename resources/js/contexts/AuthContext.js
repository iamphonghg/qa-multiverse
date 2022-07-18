import React, { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getToken, setToken } from '../utils/auth';
import AuthAPI from '../api/AuthAPI';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const authenticated = useMemo(() => !!currentUser, [currentUser]);
  const toast = useToast();

  const initAuth = async () => {
    return getToken() ? AuthAPI.getUser() : Promise.resolve(null);
  };

  useEffect(() => {
    initAuth()
      .then((user) => {
        setCurrentUser(user);
        setInitializing(false);
      })
      .catch(() => {
        setInitializing(false);
        toast({
          title: 'Phiên đăng nhập hết hạn!',
          description: ' Vui lòng đăng nhập lại',
          status: 'warning'
        });
        return <Navigate to="/login" />;
      });
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        initializing,
        authenticated,
        currentUser,
        setToken,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default AuthProvider;
export { useAuth };
