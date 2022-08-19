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

import AdminAuthAPI from '../api/AdminAuthAPI';
import { getAdminToken, removeAdminToken } from '../utils/adminAuth';

const AdminAuthContext = createContext();

function AdminAuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const authenticated = useMemo(() => !!currentAdmin, [currentAdmin]);
  const toast = useToast();

  const initAuth = async () => {
    return getAdminToken()
      ? AdminAuthAPI.getAdmin()
      : Promise.resolve(null);
  };

  useEffect(() => {
    initAuth()
      .then((admin) => {
        setCurrentAdmin(admin);
        setInitializing(false);
      })
      .catch(() => {
        setInitializing(false);
        toast({
          title: 'Phiên đăng nhập hết hạn!',
          description: ' Vui lòng đăng nhập lại',
          status: 'warning'
        });
        removeAdminToken();
        return <Navigate to="/admin/login" />;
      });
  }, [toast]);

  return (
    <AdminAuthContext.Provider
      value={{
        initializing,
        authenticated,
        currentAdmin,
        setCurrentAdmin
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (context === undefined) {
    throw new Error(
      'useAdminAuth must be used within a AdminAuthProvider'
    );
  }

  return context;
};

AdminAuthProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default AdminAuthProvider;
export { useAdminAuth };
