import React, { useEffect } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import moment from 'moment';
import AppFrame from './layouts/AppFrame';
import UserAuthProvider from './contexts/UserAuthContext';
import AppProvider from './contexts/AppContext';
import AdminAuthProvider from './contexts/AdminAuthContext';

const queryClient = new QueryClient();

export default function App() {
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: 'gray.50'
        }
      }
    },
    fonts: {
      body: "'SF Pro Display', sans-serif",
      logoFont: "'Sofia', cursive;"
    }
  });

  useEffect(() => {
    moment.locale('vi');
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AdminAuthProvider>
            <UserAuthProvider>
              <AppFrame />
            </UserAuthProvider>
          </AdminAuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
