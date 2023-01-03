import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getUserToken, removeUserToken } from '../utils/userAuth';
import AuthAPI from '../api/UserAuthAPI';

const UserAuthContext = createContext();

function UserAuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const authenticated = useMemo(() => !!currentUser, [currentUser]);
  const toast = useToast();

  const initAuth = async () => {
    return getUserToken() ? AuthAPI.getUser() : Promise.resolve(null);
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
        removeUserToken();
        return <Navigate to="/login" />;
      });
  }, [toast]);

  return (
    <UserAuthContext.Provider
      value={{
        initializing,
        authenticated,
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

const useUserAuth = () => {
  const context = useContext(UserAuthContext);

  if (context === undefined) {
    throw new Error(
      `useUserAuth must be used within a UserAuthProvider`
    );
  }

  return context;
};

UserAuthProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default UserAuthProvider;
export { useUserAuth };
